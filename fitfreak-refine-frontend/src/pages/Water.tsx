import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Droplets, 
  Calendar,
  Target,
  TrendingUp,
  Trash2
} from "lucide-react";
import { api } from "@/integrations/api/client";
import { useAuth } from "@/hooks/useAuth";

interface WaterEntry {
  date: string;
  amountInMilliliters: number;
  _id?: string;
}

interface WaterGoal {
  goalWater: number;
}

export default function Water() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [waterGoal, setWaterGoal] = useState<WaterGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isGoalLoading, setIsGoalLoading] = useState(true);

  // Add water form state
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { isAuthenticated } = useAuth();

  const fetchTodaysWater = useCallback(async (targetDate: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/watertrack/getwaterbydate', { date: targetDate });
      if (data?.ok) {
        setWaterEntries(data.data || []);
      } else {
        setWaterEntries([]);
      }
    } catch (error) {
      console.error('Error fetching water entries:', error);
      setWaterEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWaterGoal = useCallback(async () => {
    try {
      setIsGoalLoading(true);
      const { data } = await api.get('/watertrack/getusergoalwater');
      if (data?.ok) {
        setWaterGoal(data.data);
      } else {
        setWaterGoal(null);
      }
    } catch (error) {
      console.error('Error fetching water goal:', error);
      setWaterGoal(null);
    } finally {
      setIsGoalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWaterGoal();
    } else {
      setWaterGoal(null);
      setIsGoalLoading(false);
    }
  }, [isAuthenticated, fetchWaterGoal]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodaysWater(selectedDate);
    } else {
      setWaterEntries([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedDate, fetchTodaysWater]);

  const addWaterEntry = async () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter the amount of water",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please sign in to log water intake",
        variant: "destructive",
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);

    try {
      const { data } = await api.post('/watertrack/addwaterentry', {
        date: selectedDate,
        amountInMilliliters: parsedAmount,
      });

      if (data?.ok) {
        toast({
          title: "Success",
          description: "Water intake logged successfully!",
        });
        setAmount("");
        fetchTodaysWater(selectedDate);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to log water intake",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Network error while logging water intake";
      console.error('Error adding water entry:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const deleteWaterEntry = async (entryDate: string) => {
    try {
      const { data } = await api.post('/watertrack/deletewaterentry', { date: entryDate });
      if (data?.ok) {
        toast({
          title: "Success",
          description: "Water entry deleted successfully!",
        });
        fetchTodaysWater(selectedDate);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to delete entry",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error while deleting entry",
        variant: "destructive",
      });
    }
  };

  const totalWater = waterEntries.reduce((sum, entry) => sum + (entry.amountInMilliliters || 0), 0);
  const waterInLiters = totalWater / 1000;
  const goalWater = waterGoal?.goalWater || 4000;
  const waterProgress = goalWater > 0 ? (totalWater / goalWater) * 100 : 0;
  const remainingWater = goalWater - totalWater;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">Water Intake Tracking</h1>
              <p className="text-muted-foreground">
                Monitor your daily hydration and stay healthy
              </p>
            </div>

            {/* Date Selector */}
            <div className="flex items-center gap-4">
              <Label htmlFor="date">Select Date:</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>

          {/* Water Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Droplets className="h-5 w-5" />
                  Water Consumed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">
                  {waterInLiters.toFixed(2)} L
                </div>
                <p className="text-sm text-blue-600">{totalWater} ml today</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <Target className="h-5 w-5" />
                  Daily Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-800">
                  {isGoalLoading ? '—' : (goalWater / 1000).toFixed(1)} L
                </div>
                <p className="text-sm text-indigo-600">{goalWater} ml target</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">
                  {remainingWater > 0 ? (remainingWater / 1000).toFixed(2) : 0} L
                </div>
                <p className="text-sm text-green-600">
                  {remainingWater > 0 ? `${remainingWater} ml left` : 'Goal achieved!'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {waterGoal && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Progress</span>
                    <span>{Math.round(waterProgress)}%</span>
                  </div>
                  <Progress value={waterProgress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 ml</span>
                    <span>{goalWater} ml</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Water Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Water Intake
                </CardTitle>
                <CardDescription>
                  Log your water consumption throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (ml)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 250, 500, 1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Common amounts: 250ml (glass), 500ml (bottle), 1000ml (liter)
                  </p>
                </div>

                <Button 
                  onClick={addWaterEntry} 
                  className="w-full" 
                  disabled={isAdding}
                >
                  {isAdding ? 'Adding...' : 'Add Water Intake'}
                </Button>
              </CardContent>
            </Card>

            {/* Water Entries List */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Entries</CardTitle>
                <CardDescription>
                  {waterEntries.length} {waterEntries.length === 1 ? 'entry' : 'entries'} logged
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                ) : waterEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No water entries for this date. Start logging your intake!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {waterEntries.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Droplets className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">
                              {entry.amountInMilliliters} ml
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(entry.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWaterEntry(entry.date)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

