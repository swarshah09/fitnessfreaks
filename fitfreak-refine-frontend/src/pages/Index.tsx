import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeroSection } from "@/components/fitness/HeroSection";
import { MetricCard } from "@/components/fitness/MetricCard";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { api } from "@/integrations/api/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Utensils,
  Droplets,
  Moon,
  Activity,
  Weight,
  Footprints,
  Flame,
  Heart,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user: authUser, isAuthenticated } = useAuth();
  const { profile } = useProfile();
  
  // State for today's data
  const [caloriesData, setCaloriesData] = useState({ total: 0, goal: 0, protein: 0, carbs: 0 });
  const [waterData, setWaterData] = useState({ total: 0, goal: 4000 });
  const [sleepData, setSleepData] = useState({ total: 0, goal: 8 });
  const [stepsData, setStepsData] = useState({ total: 0, goal: 10000 });
  const [weightData, setWeightData] = useState({ current: null as number | null, goal: null as number | null });
  const [streakData, setStreakData] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Fetch all today's data
  const fetchTodayData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch calories
      try {
        const caloriesRes = await api.post('/calorieintake/getcalorieintakebydate', { date: today });
        const caloriesGoalRes = await api.get('/calorieintake/getgoalcalorieintake');
        if (caloriesRes.data?.ok) {
          const total = caloriesRes.data.data?.reduce((sum: number, entry: any) => sum + (entry.calorieIntake || 0), 0) || 0;
          const protein = caloriesRes.data.data?.reduce((sum: number, entry: any) => sum + (entry.protein || 0), 0) || 0;
          const carbs = caloriesRes.data.data?.reduce((sum: number, entry: any) => sum + (entry.carbs || 0), 0) || 0;
          const goal = caloriesGoalRes.data?.ok ? caloriesGoalRes.data.data?.maxCalorieIntake || 0 : 0;
          setCaloriesData({ total, goal, protein, carbs });
        }
      } catch (e) {
        console.error('Error fetching calories:', e);
      }

      // Fetch water
      try {
        const waterRes = await api.post('/watertrack/getwaterbydate', { date: today });
        const waterGoalRes = await api.get('/watertrack/getusergoalwater');
        if (waterRes.data?.ok) {
          const total = waterRes.data.data?.reduce((sum: number, entry: any) => sum + (entry.amountInMilliliters || 0), 0) || 0;
          const goal = waterGoalRes.data?.ok ? waterGoalRes.data.data?.goalWater || 4000 : 4000;
          setWaterData({ total, goal });
        }
      } catch (e) {
        console.error('Error fetching water:', e);
      }

      // Fetch sleep
      try {
        const sleepRes = await api.post('/sleeptrack/getsleepbydate', { date: today });
        const sleepGoalRes = await api.get('/sleeptrack/getusersleep');
        if (sleepRes.data?.ok) {
          const entries = sleepRes.data.data || [];
          const total = entries.length > 0 ? entries.reduce((sum: number, entry: any) => sum + (entry.durationInHrs || 0), 0) / entries.length : 0;
          const goal = sleepGoalRes.data?.ok ? sleepGoalRes.data.data?.goalSleep || 8 : 8;
          setSleepData({ total, goal });
        }
      } catch (e) {
        console.error('Error fetching sleep:', e);
      }

      // Fetch steps
      try {
        const stepsRes = await api.post('/steptrack/getstepsbydate', { date: today });
        const stepsGoalRes = await api.get('/steptrack/getusergoalsteps');
        if (stepsRes.data?.ok) {
          const total = stepsRes.data.data?.reduce((sum: number, entry: any) => sum + (entry.steps || 0), 0) || 0;
          const goal = stepsGoalRes.data?.ok ? stepsGoalRes.data.data?.totalSteps || 10000 : 10000;
          setStepsData({ total, goal });
        }
      } catch (e) {
        console.error('Error fetching steps:', e);
      }

      // Fetch weight
      try {
        const weightGoalRes = await api.get('/weighttrack/getusergoalweight');
        if (weightGoalRes.data?.ok) {
          const current = weightGoalRes.data.data?.currentWeight || null;
          const goal = weightGoalRes.data.data?.goalWeight || null;
          setWeightData({ current, goal });
        }
      } catch (e) {
        console.error('Error fetching weight:', e);
      }

      // Fetch daily activity streak
      try {
        const streakRes = await api.get('/daily-activity/streak');
        if (streakRes.data?.ok) {
          setStreakData(streakRes.data.data?.streak ?? 0);
        }
      } catch (e) {
        console.error('Error fetching streak:', e);
      }
    } catch (error) {
      console.error('Error fetching today\'s data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, today]);

  useEffect(() => {
    fetchTodayData();
  }, [fetchTodayData]);

  // Fetch detailed data for modal
  const fetchMetricDetails = useCallback(async (metricTitle: string) => {
    setIsModalLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      switch (metricTitle) {
        case "Nutrition Count Today": {
          const res = await api.post('/calorieintake/getcalorieintakebydate', { date: today });
          const goalRes = await api.get('/calorieintake/getgoalcalorieintake');
          if (res.data?.ok) {
            const entries = res.data.data || [];
            const total = entries.reduce((sum: number, entry: any) => sum + (entry.calorieIntake || 0), 0);
            const protein = entries.reduce((sum: number, entry: any) => sum + (entry.protein || 0), 0);
            const carbs = entries.reduce((sum: number, entry: any) => sum + (entry.carbs || 0), 0);
            const goal = goalRes.data?.ok ? goalRes.data.data?.maxCalorieIntake || 0 : 0;
            setModalData({ entries, total, protein, carbs, goal, type: 'nutrition' });
          }
          break;
        }
        case "Water Intake": {
          const res = await api.post('/watertrack/getwaterbydate', { date: today });
          const goalRes = await api.get('/watertrack/getusergoalwater');
          if (res.data?.ok) {
            const entries = res.data.data || [];
            const total = entries.reduce((sum: number, entry: any) => sum + (entry.amountInMilliliters || 0), 0);
            const goal = goalRes.data?.ok ? goalRes.data.data?.goalWater || 4000 : 4000;
            setModalData({ entries, total, goal, type: 'water' });
          }
          break;
        }
        case "Sleep Last Night": {
          const res = await api.post('/sleeptrack/getsleepbydate', { date: today });
          const goalRes = await api.get('/sleeptrack/getusersleep');
          if (res.data?.ok) {
            const entries = res.data.data || [];
            const total = entries.length > 0 
              ? entries.reduce((sum: number, entry: any) => sum + (entry.durationInHrs || 0), 0) / entries.length 
              : 0;
            const goal = goalRes.data?.ok ? goalRes.data.data?.goalSleep || 8 : 8;
            setModalData({ entries, total, goal, type: 'sleep' });
          }
          break;
        }
        case "Steps Today": {
          const res = await api.post('/steptrack/getstepsbydate', { date: today });
          const goalRes = await api.get('/steptrack/getusergoalsteps');
          if (res.data?.ok) {
            const entries = res.data.data || [];
            const total = entries.reduce((sum: number, entry: any) => sum + (entry.steps || 0), 0);
            const goal = goalRes.data?.ok ? goalRes.data.data?.totalSteps || 10000 : 10000;
            setModalData({ entries, total, goal, type: 'steps' });
          }
          break;
        }
        case "Current Weight": {
          const res = await api.get('/weighttrack/getusergoalweight');
          if (res.data?.ok) {
            const current = res.data.data?.currentWeight || null;
            const goal = res.data.data?.goalWeight || null;
            setModalData({ current, goal, type: 'weight' });
          }
          break;
        }
        default:
          setModalData(null);
      }
    } catch (error) {
      console.error('Error fetching metric details:', error);
      setModalData(null);
    } finally {
      setIsModalLoading(false);
    }
  }, []);

  const handleViewClick = (metricTitle: string) => {
    setSelectedMetric(metricTitle);
    setModalOpen(true);
    fetchMetricDetails(metricTitle);
  };

  // Transform auth user data for hero section
  const user = authUser && profile ? {
    name: profile.name || authUser.email,
    email: authUser.email,
    avatar: "",
    totalWorkouts: 47, // Will be replaced with real data from backend
    weeklyGoal: 5,
    currentStreak: streakData ?? 0,
  } : null;

  // Calculate metrics with real data
  const caloriesProgress = caloriesData.goal > 0 ? (caloriesData.total / caloriesData.goal) * 100 : 0;
  const waterProgress = waterData.goal > 0 ? (waterData.total / waterData.goal) * 100 : 0;
  const sleepProgress = sleepData.goal > 0 ? (sleepData.total / sleepData.goal) * 100 : 0;
  const stepsProgress = stepsData.goal > 0 ? (stepsData.total / stepsData.goal) * 100 : 0;
  
  // Calculate weight progress: progress increases as you get closer to goal from either direction
  const weightProgress = weightData.current && weightData.goal
    ? weightData.current < weightData.goal
      ? (weightData.current / weightData.goal) * 100  // Need to gain: progress = current/goal
      : (weightData.goal / weightData.current) * 100  // Need to lose: progress = goal/current
    : 0;

  const fitnessMetrics = [
    {
      title: "Nutrition Count Today",
      value: isLoading ? "—" : caloriesData.total,
      target: caloriesData.goal,
      unit: "kcal",
      icon: Flame,
      trend: "up" as const,
      trendValue: caloriesData.goal > 0 ? `${Math.round(caloriesProgress)}% of goal` : "Set a goal",
      progress: Math.min(caloriesProgress, 100),
      color: "warning" as const,
      children: !isLoading && (
        <p className="text-sm text-muted-foreground">
          {caloriesData.protein.toFixed(1)}g protein • {caloriesData.carbs.toFixed(1)}g carbs
        </p>
      ),
    },
    {
      title: "Water Intake",
      value: isLoading ? "—" : `${(waterData.total / 1000).toFixed(1)} L`,
      target: `${(waterData.goal / 1000).toFixed(1)} L`,
      unit: "",
      icon: Droplets,
      trend: "up" as const,
      trendValue: waterData.goal > 0 ? `${Math.round(waterProgress)}% of goal` : "Set a goal",
      progress: Math.min(waterProgress, 100),
      color: "info" as const,
    },
    {
      title: "Sleep Last Night",
      value: isLoading ? "—" : sleepData.total > 0 ? sleepData.total.toFixed(1) : "—",
      target: sleepData.goal,
      unit: "hours",
      icon: Moon,
      trend: "neutral" as const,
      trendValue: sleepData.total > 0 ? `${Math.round(sleepProgress)}% of goal` : "Log sleep",
      progress: Math.min(sleepProgress, 100),
      color: "primary" as const,
    },
    {
      title: "Steps Today",
      value: isLoading ? "—" : stepsData.total.toLocaleString(),
      target: stepsData.goal.toLocaleString(),
      unit: "steps",
      icon: Footprints,
      trend: "up" as const,
      trendValue: stepsData.goal > 0 ? `${Math.round(stepsProgress)}% of goal` : "Set a goal",
      progress: Math.min(stepsProgress, 100),
      color: "success" as const,
    },
    {
      title: "Current Weight",
      value: isLoading ? "—" : weightData.current ? weightData.current.toFixed(1) : "—",
      target: weightData.goal ? weightData.goal.toFixed(1) : null,
      unit: "kg",
      icon: Weight,
      // Trend: "up" when need to gain (current < goal), "down" when need to lose (current > goal)
      trend: weightData.current && weightData.goal 
        ? (weightData.current < weightData.goal ? "up" : "down")
        : "neutral" as const,
      trendValue: weightData.current && weightData.goal 
        ? `${Math.abs(weightData.current - weightData.goal).toFixed(1)}kg ${weightData.current < weightData.goal ? 'to goal' : 'over goal'}`
        : "Set a goal",
      progress: Math.min(weightProgress, 100),
      color: "primary" as const,
    },
    {
      title: "Heart Rate",
      value: 72,
      unit: "bpm",
      icon: Heart,
      trend: "neutral" as const,
      trendValue: "Resting rate",
      color: "success" as const,
    },
  ];

  // Navigation paths for each metric
  const metricPaths: Record<string, string> = {
    "Nutrition Count Today": "/nutrition",
    "Water Intake": "/water",
    "Sleep Last Night": "/sleep",
    "Steps Today": "/steps",
    "Current Weight": "/weight",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Hero Section */}
          <HeroSection user={user} />

          {/* Fitness Metrics Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Today's Overview</h2>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fitnessMetrics.map((metric, index) => {
                const viewPath = metricPaths[metric.title];
                return (
                  <MetricCard
                    key={metric.title}
                    {...metric}
                    className="hover:scale-105 transition-transform duration-200"
                    onAdd={() => {
                      if (viewPath) {
                        navigate(viewPath);
                      }
                    }}
                    onView={() => {
                      handleViewClick(metric.title);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Quick Workout"
              value="Start Now"
              icon={Activity}
              color="primary"
              onAdd={() => navigate("/workouts")}
            >
              <p className="text-xs text-muted-foreground">
                5-minute quick exercises to boost your energy
              </p>
            </MetricCard>

            <MetricCard
              title="Log Meal"
              value="Add Food"
              icon={Utensils}
              color="success"
              onAdd={() => navigate("/nutrition")}
            >
              <p className="text-xs text-muted-foreground">
                Track your nutrition and stay on target
              </p>
            </MetricCard>
          </div>
        </main>
      </div>

      {/* Metric Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMetric}</DialogTitle>
            <DialogDescription>
              Detailed information for {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </DialogDescription>
          </DialogHeader>

          {isModalLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : modalData ? (
            <div className="space-y-4">
              {modalData.type === 'nutrition' && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Calories</span>
                          <span className="text-2xl font-bold text-orange-600">
                            {modalData.total} kcal
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Protein</span>
                          <span className="text-lg font-semibold text-indigo-600">
                            {modalData.protein.toFixed(1)} g
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Carbs</span>
                          <span className="text-lg font-semibold text-emerald-600">
                            {modalData.carbs.toFixed(1)} g
                          </span>
                        </div>
                        {modalData.goal > 0 && (
                          <>
                            <div className="pt-2">
                              <div className="flex justify-between text-sm mb-2">
                                <span>Goal: {modalData.goal} kcal</span>
                                <span>{Math.round((modalData.total / modalData.goal) * 100)}%</span>
                              </div>
                              <Progress value={Math.min((modalData.total / modalData.goal) * 100, 100)} />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {modalData.entries && modalData.entries.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Today's Meals</h3>
                        <div className="space-y-3">
                          {modalData.entries.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="space-y-1">
                                <p className="font-medium">{entry.item}</p>
                                <p className="text-sm text-muted-foreground">
                                  {entry.quantity}{entry.quantitytype}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                                    {entry.calorieIntake} kcal
                                  </span>
                                  {entry.protein !== undefined && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                                      {entry.protein.toFixed(1)}g protein
                                    </span>
                                  )}
                                  {entry.carbs !== undefined && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                      {entry.carbs.toFixed(1)}g carbs
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {modalData.type === 'water' && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Water Intake</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {(modalData.total / 1000).toFixed(1)} L
                          </span>
                        </div>
                        {modalData.goal > 0 && (
                          <>
                            <div className="pt-2">
                              <div className="flex justify-between text-sm mb-2">
                                <span>Goal: {(modalData.goal / 1000).toFixed(1)} L</span>
                                <span>{Math.round((modalData.total / modalData.goal) * 100)}%</span>
                              </div>
                              <Progress value={Math.min((modalData.total / modalData.goal) * 100, 100)} />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {modalData.entries && modalData.entries.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Today's Entries</h3>
                        <div className="space-y-2">
                          {modalData.entries.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <span className="text-sm">{new Date(entry.date).toLocaleTimeString()}</span>
                              <span className="font-semibold text-blue-600">
                                {(entry.amountInMilliliters / 1000).toFixed(1)} L
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {modalData.type === 'sleep' && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Sleep Duration</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {modalData.total > 0 ? modalData.total.toFixed(1) : "—"} hours
                          </span>
                        </div>
                        {modalData.goal > 0 && (
                          <>
                            <div className="pt-2">
                              <div className="flex justify-between text-sm mb-2">
                                <span>Goal: {modalData.goal} hours</span>
                                <span>{modalData.total > 0 ? Math.round((modalData.total / modalData.goal) * 100) : 0}%</span>
                              </div>
                              <Progress value={Math.min((modalData.total / modalData.goal) * 100, 100)} />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {modalData.entries && modalData.entries.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Sleep Sessions</h3>
                        <div className="space-y-2">
                          {modalData.entries.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium">
                                  {new Date(entry.sleepStartTime).toLocaleTimeString()} - {new Date(entry.sleepEndTime).toLocaleTimeString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {entry.quality || 'No quality rating'}
                                </p>
                              </div>
                              <span className="font-semibold text-purple-600">
                                {entry.durationInHrs.toFixed(1)}h
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {modalData.type === 'steps' && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Steps</span>
                          <span className="text-2xl font-bold text-green-600">
                            {modalData.total.toLocaleString()}
                          </span>
                        </div>
                        {modalData.goal > 0 && (
                          <>
                            <div className="pt-2">
                              <div className="flex justify-between text-sm mb-2">
                                <span>Goal: {modalData.goal.toLocaleString()} steps</span>
                                <span>{Math.round((modalData.total / modalData.goal) * 100)}%</span>
                              </div>
                              <Progress value={Math.min((modalData.total / modalData.goal) * 100, 100)} />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {modalData.entries && modalData.entries.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Step Entries</h3>
                        <div className="space-y-2">
                          {modalData.entries.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <span className="text-sm">{new Date(entry.date).toLocaleTimeString()}</span>
                              <span className="font-semibold text-green-600">
                                {entry.steps.toLocaleString()} steps
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {modalData.type === 'weight' && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Current Weight</span>
                        <span className="text-2xl font-bold text-slate-600">
                          {modalData.current ? `${modalData.current.toFixed(1)} kg` : "—"}
                        </span>
                      </div>
                      {modalData.goal && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Goal Weight</span>
                            <span className="text-lg font-semibold text-slate-600">
                              {modalData.goal.toFixed(1)} kg
                            </span>
                          </div>
                          {modalData.current && (
                            <div className="pt-2">
                              <div className="flex justify-between text-sm mb-2">
                                <span>
                                  {modalData.current < modalData.goal 
                                    ? `Need to gain: ${(modalData.goal - modalData.current).toFixed(1)} kg`
                                    : `Need to lose: ${(modalData.current - modalData.goal).toFixed(1)} kg`
                                  }
                                </span>
                                <span>
                                  {Math.round(
                                    modalData.current < modalData.goal
                                      ? (modalData.current / modalData.goal) * 100
                                      : (modalData.goal / modalData.current) * 100
                                  )}%
                                </span>
                              </div>
                              <Progress 
                                value={Math.min(
                                  modalData.current < modalData.goal
                                    ? (modalData.current / modalData.goal) * 100
                                    : (modalData.goal / modalData.current) * 100,
                                  100
                                )} 
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(!modalData.entries || modalData.entries.length === 0) && modalData.type !== 'weight' && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No entries found for today.</p>
                  <p className="text-sm mt-2">Click "Add" to start tracking!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Unable to load details. Please try again.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
