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
  Moon, 
  Calendar,
  Target,
  TrendingUp,
  Trash2
} from "lucide-react";
import { api } from "@/integrations/api/client";
import { useAuth } from "@/hooks/useAuth";

interface SleepEntry {
  date: string;
  durationInHrs: number;
  _id?: string;
}

interface SleepGoal {
  goalSleep: number;
}

export default function Sleep() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [sleepGoal, setSleepGoal] = useState<SleepGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isGoalLoading, setIsGoalLoading] = useState(true);

  // Add sleep form state
  const [duration, setDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { isAuthenticated } = useAuth();

  const fetchTodaysSleep = useCallback(async (targetDate: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/sleeptrack/getsleepbydate', { date: targetDate });
      if (data?.ok) {
        setSleepEntries(data.data || []);
      } else {
        setSleepEntries([]);
      }
    } catch (error) {
      console.error('Error fetching sleep entries:', error);
      setSleepEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSleepGoal = useCallback(async () => {
    try {
      setIsGoalLoading(true);
      const { data } = await api.get('/sleeptrack/getusersleep');
      if (data?.ok) {
        setSleepGoal(data.data);
      } else {
        setSleepGoal(null);
      }
    } catch (error) {
      console.error('Error fetching sleep goal:', error);
      setSleepGoal(null);
    } finally {
      setIsGoalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSleepGoal();
    } else {
      setSleepGoal(null);
      setIsGoalLoading(false);
    }
  }, [isAuthenticated, fetchSleepGoal]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodaysSleep(selectedDate);
    } else {
      setSleepEntries([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedDate, fetchTodaysSleep]);

  const addSleepEntry = async () => {
    if (!duration) {
      toast({
        title: "Error",
        description: "Please enter the sleep duration",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please sign in to log sleep",
        variant: "destructive",
      });
      return;
    }

    const parsedDuration = parseFloat(duration);
    if (!parsedDuration || parsedDuration <= 0 || parsedDuration > 24) {
      toast({
        title: "Error",
        description: "Please enter a valid duration (0-24 hours)",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);

    try {
      const { data } = await api.post('/sleeptrack/addsleepentry', {
        date: selectedDate,
        durationInHrs: parsedDuration,
      });

      if (data?.ok) {
        toast({
          title: "Success",
          description: "Sleep entry logged successfully!",
        });
        setDuration("");
        fetchTodaysSleep(selectedDate);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to log sleep entry",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Network error while logging sleep entry";
      console.error('Error adding sleep entry:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const deleteSleepEntry = async (entryDate: string) => {
    try {
      const { data } = await api.post('/sleeptrack/deletesleepentry', { date: entryDate });
      if (data?.ok) {
        toast({
          title: "Success",
          description: "Sleep entry deleted successfully!",
        });
        fetchTodaysSleep(selectedDate);
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

  const totalSleep = sleepEntries.reduce((sum, entry) => sum + (entry.durationInHrs || 0), 0);
  const avgSleep = sleepEntries.length > 0 ? totalSleep / sleepEntries.length : 0;
  const goalSleep = sleepGoal?.goalSleep || 8;
  const sleepProgress = goalSleep > 0 ? (avgSleep / goalSleep) * 100 : 0;
  const remainingSleep = goalSleep - avgSleep;

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">Sleep Tracking</h1>
              <p className="text-muted-foreground">
                Monitor your sleep patterns and improve your rest quality
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

          {/* Sleep Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Moon className="h-5 w-5" />
                  Sleep Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-800">
                  {avgSleep.toFixed(1)} hrs
                </div>
                <p className="text-sm text-purple-600">
                  {sleepEntries.length > 0 ? `${totalSleep.toFixed(1)} hrs total` : 'No entries'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <Target className="h-5 w-5" />
                  Daily Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-800">
                  {isGoalLoading ? '—' : goalSleep} hrs
                </div>
                <p className="text-sm text-indigo-600">Recommended sleep</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">
                  {remainingSleep <= 0 ? '✓' : remainingSleep.toFixed(1)}
                </div>
                <p className="text-sm text-green-600">
                  {remainingSleep <= 0 ? 'Goal achieved!' : `${remainingSleep.toFixed(1)} hrs to goal`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {sleepGoal && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sleep Progress</span>
                    <span>{Math.round(sleepProgress)}%</span>
                  </div>
                  <Progress value={sleepProgress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 hrs</span>
                    <span>{goalSleep} hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Sleep Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Sleep Entry
                </CardTitle>
                <CardDescription>
                  Log your sleep duration for better tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 7.5, 8, 8.5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="0"
                    max="24"
                    step="0.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 7-9 hours for adults
                  </p>
                </div>

                <Button 
                  onClick={addSleepEntry} 
                  className="w-full" 
                  disabled={isAdding}
                >
                  {isAdding ? 'Adding...' : 'Add Sleep Entry'}
                </Button>
              </CardContent>
            </Card>

            {/* Sleep Entries List */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Entries</CardTitle>
                <CardDescription>
                  {sleepEntries.length} {sleepEntries.length === 1 ? 'entry' : 'entries'} logged
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading...
                  </div>
                ) : sleepEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No sleep entries for this date. Start logging your sleep!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {sleepEntries.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Moon className="h-5 w-5 text-purple-500" />
                          <div>
                            <div className="font-medium">
                              {entry.durationInHrs} hours
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
                          onClick={() => deleteSleepEntry(entry.date)}
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

