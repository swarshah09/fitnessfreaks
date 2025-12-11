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
  Weight as WeightIcon, 
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Trash2
} from "lucide-react";
import { api } from "@/integrations/api/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface WeightEntry {
  date: string;
  weight: number;
  _id?: string;
}

interface WeightGoal {
  currentWeight: number | null;
  goalWeight: number;
}

export default function Weight() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [weightGoal, setWeightGoal] = useState<WeightGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isGoalLoading, setIsGoalLoading] = useState(true);

  // Add weight form state
  const [weight, setWeight] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();

  const fetchTodaysWeight = useCallback(async (targetDate: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/weighttrack/getweightbydate', { date: targetDate });
      if (data?.ok) {
        setWeightEntries(data.data || []);
      } else {
        setWeightEntries([]);
      }
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      setWeightEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWeightGoal = useCallback(async () => {
    try {
      setIsGoalLoading(true);
      const { data } = await api.get('/weighttrack/getusergoalweight');
      if (data?.ok) {
        // Use profile weight as fallback if currentWeight is null
        const currentWeight = data.data?.currentWeight || profile?.weight || null;
        setWeightGoal({
          currentWeight,
          goalWeight: data.data?.goalWeight || null,
        });
      } else {
        // Fallback to profile weight if API fails
        setWeightGoal({
          currentWeight: profile?.weight || null,
          goalWeight: null,
        });
      }
    } catch (error) {
      console.error('Error fetching weight goal:', error);
      // Fallback to profile weight
      setWeightGoal({
        currentWeight: profile?.weight || null,
        goalWeight: null,
      });
    } finally {
      setIsGoalLoading(false);
    }
  }, [profile?.weight]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeightGoal();
    } else {
      setWeightGoal(null);
      setIsGoalLoading(false);
    }
  }, [isAuthenticated, fetchWeightGoal, profile?.weight]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodaysWeight(selectedDate);
    } else {
      setWeightEntries([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedDate, fetchTodaysWeight]);

  const addWeightEntry = async () => {
    if (!weight) {
      toast({
        title: "Error",
        description: "Please enter your weight",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please sign in to log weight",
        variant: "destructive",
      });
      return;
    }

    const parsedWeight = parseFloat(weight);
    if (!parsedWeight || parsedWeight <= 0 || parsedWeight > 500) {
      toast({
        title: "Error",
        description: "Please enter a valid weight (0-500 kg)",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);

    try {
      const { data } = await api.post('/weighttrack/addweightentry', {
        date: selectedDate,
        weightInKg: parsedWeight,
      });

      if (data?.ok) {
        toast({
          title: "Success",
          description: "Weight logged successfully!",
        });
        setWeight("");
        fetchTodaysWeight(selectedDate);
        fetchWeightGoal(); // Refresh goal to get updated current weight
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to log weight",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Network error while logging weight";
      console.error('Error adding weight entry:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const deleteWeightEntry = async (entryDate: string) => {
    try {
      const { data } = await api.post('/weighttrack/deleteweightentry', { date: entryDate });
      if (data?.ok) {
        toast({
          title: "Success",
          description: "Weight entry deleted successfully!",
        });
        fetchTodaysWeight(selectedDate);
        fetchWeightGoal(); // Refresh goal
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

  // Get latest weight: from today's entries, or from weight goal, or from profile
  const latestWeight = weightEntries.length > 0 
    ? weightEntries[weightEntries.length - 1].weight 
    : weightGoal?.currentWeight || profile?.weight || null;
  
  const goalWeight = weightGoal?.goalWeight || null;
  const weightDifference = latestWeight && goalWeight 
    ? latestWeight - goalWeight 
    : null;
  
  const weightProgress = latestWeight && goalWeight && weightDifference !== null
    ? Math.abs(weightDifference) / goalWeight * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">Weight Tracking</h1>
              <p className="text-muted-foreground">
                Monitor your weight progress and achieve your goals
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

          {/* Weight Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <WeightIcon className="h-5 w-5" />
                  Current Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">
                  {latestWeight ? `${latestWeight.toFixed(1)} kg` : '—'}
                </div>
                <p className="text-sm text-blue-600">
                  {latestWeight ? 'Latest entry' : 'No entries yet'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Target className="h-5 w-5" />
                  Goal Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-800">
                  {isGoalLoading ? '—' : goalWeight ? `${goalWeight.toFixed(1)} kg` : '—'}
                </div>
                <p className="text-sm text-purple-600">Target weight</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  {weightDifference !== null && weightDifference < 0 ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : weightDifference !== null && weightDifference > 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <Target className="h-5 w-5" />
                  )}
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">
                  {weightDifference !== null 
                    ? `${Math.abs(weightDifference).toFixed(1)} kg ${weightDifference < 0 ? 'below' : 'above'}`
                    : '—'}
                </div>
                <p className="text-sm text-green-600">
                  {weightDifference !== null && weightDifference === 0 
                    ? 'Goal achieved!' 
                    : weightDifference !== null 
                    ? 'from goal'
                    : 'Set a goal'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {goalWeight && latestWeight && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weight Progress</span>
                    <span>
                      {weightDifference !== null && weightDifference === 0 
                        ? 'Goal Reached!' 
                        : `${Math.abs(weightDifference || 0).toFixed(1)} kg ${weightDifference !== null && weightDifference < 0 ? 'to go' : 'over'}`}
                    </span>
                  </div>
                  <Progress 
                    value={weightDifference !== null && weightDifference < 0 
                      ? (Math.abs(weightDifference) / goalWeight) * 100 
                      : 100} 
                    className="h-3" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{latestWeight.toFixed(1)} kg</span>
                    <span>{goalWeight.toFixed(1)} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Weight Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Weight Entry
                </CardTitle>
                <CardDescription>
                  Log your weight to track your progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 70.5, 75, 80.2"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="0"
                    max="500"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Weigh yourself at the same time each day for accurate tracking
                  </p>
                </div>

                <Button 
                  onClick={addWeightEntry} 
                  className="w-full" 
                  disabled={isAdding}
                >
                  {isAdding ? 'Adding...' : 'Add Weight Entry'}
                </Button>
              </CardContent>
            </Card>

            {/* Weight Entries List */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Entries</CardTitle>
                <CardDescription>
                  {weightEntries.length} {weightEntries.length === 1 ? 'entry' : 'entries'} logged
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                ) : weightEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No weight entries for this date. Start logging your weight!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {weightEntries.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <WeightIcon className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">
                              {entry.weight} kg
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
                          onClick={() => deleteWeightEntry(entry.date)}
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

