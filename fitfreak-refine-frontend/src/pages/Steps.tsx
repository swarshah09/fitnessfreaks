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
  Footprints, 
  Calendar,
  Target,
  TrendingUp,
  Trash2
} from "lucide-react";
import { api } from "@/integrations/api/client";
import { useAuth } from "@/hooks/useAuth";

interface StepEntry {
  date: string;
  steps: number;
  _id?: string;
}

interface StepGoal {
  totalSteps: number;
}

export default function Steps() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>([]);
  const [stepGoal, setStepGoal] = useState<StepGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isGoalLoading, setIsGoalLoading] = useState(true);

  // Add steps form state
  const [steps, setSteps] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { isAuthenticated } = useAuth();

  const fetchTodaysSteps = useCallback(async (targetDate: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/steptrack/getstepsbydate', { date: targetDate });
      if (data?.ok) {
        setStepEntries(data.data || []);
      } else {
        setStepEntries([]);
      }
    } catch (error) {
      console.error('Error fetching step entries:', error);
      setStepEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStepGoal = useCallback(async () => {
    try {
      setIsGoalLoading(true);
      const { data } = await api.get('/steptrack/getusergoalsteps');
      if (data?.ok) {
        setStepGoal(data.data);
      } else {
        setStepGoal(null);
      }
    } catch (error) {
      console.error('Error fetching step goal:', error);
      setStepGoal(null);
    } finally {
      setIsGoalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStepGoal();
    } else {
      setStepGoal(null);
      setIsGoalLoading(false);
    }
  }, [isAuthenticated, fetchStepGoal]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodaysSteps(selectedDate);
    } else {
      setStepEntries([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedDate, fetchTodaysSteps]);

  const addStepEntry = async () => {
    if (!steps) {
      toast({
        title: "Error",
        description: "Please enter the number of steps",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please sign in to log steps",
        variant: "destructive",
      });
      return;
    }

    const parsedSteps = parseInt(steps);
    if (!parsedSteps || parsedSteps <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of steps",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);

    try {
      const { data } = await api.post('/steptrack/addstepentry', {
        date: selectedDate,
        steps: parsedSteps,
      });

      if (data?.ok) {
        toast({
          title: "Success",
          description: "Steps logged successfully!",
        });
        setSteps("");
        fetchTodaysSteps(selectedDate);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to log steps",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Network error while logging steps";
      console.error('Error adding step entry:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const deleteStepEntry = async (entryDate: string) => {
    try {
      const { data } = await api.post('/steptrack/deletestepentry', { date: entryDate });
      if (data?.ok) {
        toast({
          title: "Success",
          description: "Step entry deleted successfully!",
        });
        fetchTodaysSteps(selectedDate);
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

  const totalSteps = stepEntries.reduce((sum, entry) => sum + (entry.steps || 0), 0);
  const goalSteps = stepGoal?.totalSteps || 10000;
  const stepProgress = goalSteps > 0 ? (totalSteps / goalSteps) * 100 : 0;
  const remainingSteps = goalSteps - totalSteps;

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">Steps Tracking</h1>
              <p className="text-muted-foreground">
                Monitor your daily steps and stay active
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

          {/* Steps Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Footprints className="h-5 w-5" />
                  Steps Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">
                  {totalSteps.toLocaleString()}
                </div>
                <p className="text-sm text-green-600">steps logged</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Target className="h-5 w-5" />
                  Daily Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">
                  {isGoalLoading ? '—' : goalSteps.toLocaleString()}
                </div>
                <p className="text-sm text-blue-600">steps target</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <TrendingUp className="h-5 w-5" />
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-800">
                  {remainingSteps > 0 ? remainingSteps.toLocaleString() : '✓'}
                </div>
                <p className="text-sm text-orange-600">
                  {remainingSteps > 0 ? `${remainingSteps.toLocaleString()} to goal` : 'Goal achieved!'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {stepGoal && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Progress</span>
                    <span>{Math.round(stepProgress)}%</span>
                  </div>
                  <Progress value={stepProgress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 steps</span>
                    <span>{goalSteps.toLocaleString()} steps</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Steps Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Steps Entry
                </CardTitle>
                <CardDescription>
                  Log your daily step count manually
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="steps">Number of Steps</Label>
                  <Input
                    id="steps"
                    type="number"
                    placeholder="e.g., 5000, 10000, 15000"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    min="0"
                    step="100"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 10,000 steps per day for optimal health
                  </p>
                </div>

                <Button 
                  onClick={addStepEntry} 
                  className="w-full" 
                  disabled={isAdding}
                >
                  {isAdding ? 'Adding...' : 'Add Steps Entry'}
                </Button>
              </CardContent>
            </Card>

            {/* Steps Entries List */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Entries</CardTitle>
                <CardDescription>
                  {stepEntries.length} {stepEntries.length === 1 ? 'entry' : 'entries'} logged
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                ) : stepEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No step entries for this date. Start logging your steps!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {stepEntries.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Footprints className="h-5 w-5 text-green-500" />
                          <div>
                            <div className="font-medium">
                              {entry.steps.toLocaleString()} steps
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteStepEntry(entry.date)}
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

