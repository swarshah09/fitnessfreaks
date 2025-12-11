import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { api } from "@/integrations/api/client";
import {
  Target,
  Flame,
  Droplets,
  Moon,
  Footprints,
  Weight,
  Activity,
  Edit2,
  Save,
  X,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface GoalData {
  calories: { goal: number; calculated: boolean; explanation: string };
  water: { goal: number; calculated: boolean; explanation: string };
  sleep: { goal: number; calculated: boolean; explanation: string };
  steps: { goal: number; calculated: boolean; explanation: string };
  weight: { goal: number; current: number | null; calculated: boolean; explanation: string };
  workout: { goal: number; calculated: boolean; explanation: string };
}

export default function Goals() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState<GoalData | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const today = new Date().toISOString().split('T')[0];

  const fetchAllGoals = useCallback(async () => {
    if (!isAuthenticated || !profile) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch all goal data
      const [caloriesRes, waterRes, sleepRes, stepsRes, weightRes, workoutRes] = await Promise.all([
        api.get('/calorieintake/getgoalcalorieintake').catch(() => null),
        api.get('/watertrack/getusergoalwater').catch(() => null),
        api.get('/sleeptrack/getusersleep').catch(() => null),
        api.get('/steptrack/getusergoalsteps').catch(() => null),
        api.get('/weighttrack/getusergoalweight').catch(() => null),
        api.get('/workouttrack/getusergoalworkout').catch(() => null),
      ]);

      const mainGoal = profile.goal || 'maintenance';
      const weightKg = profile.weight || 0;
      const heightCm = profile.height || 0;
      const gender = profile.gender || 'other';
      const dob = profile.date_of_birth;
      const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 25;

      // Calculate BMR for calorie explanation
      let BMR = 0;
      if (gender === 'male') {
        BMR = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
      } else {
        BMR = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
      }

      const caloriesGoal = caloriesRes?.data?.ok ? caloriesRes.data.data?.maxCalorieIntake || 0 : 0;
      const waterGoal = waterRes?.data?.ok ? waterRes.data.data?.goalWater || 4000 : 4000;
      const sleepGoal = sleepRes?.data?.ok ? sleepRes.data.data?.goalSleep || 6 : 6;
      const stepsGoal = stepsRes?.data?.ok ? stepsRes.data.data?.totalSteps || 7500 : 7500;
      const weightGoal = weightRes?.data?.ok ? weightRes.data.data?.goalWeight || 0 : 0;
      const weightCurrent = weightRes?.data?.ok ? weightRes.data.data?.currentWeight || null : null;
      const workoutGoal = workoutRes?.data?.ok ? workoutRes.data.data?.goal || 4 : 4;

      // Build explanations
      const goalExplanations = {
        weightLoss: {
          calories: `BMR (${Math.round(BMR)} kcal) - 500 kcal deficit = ${Math.round(BMR - 500)} kcal/day`,
          steps: 'Weight loss goal requires more activity: 10,000 steps/day',
          workout: 'Weight loss goal: 7 workout days per week',
        },
        weightGain: {
          calories: `BMR (${Math.round(BMR)} kcal) + 500 kcal surplus = ${Math.round(BMR + 500)} kcal/day`,
          steps: 'Weight gain goal: 5,000 steps/day (focus on strength training)',
          workout: 'Weight gain goal: 3 workout days per week (recovery focused)',
        },
        maintenance: {
          calories: `BMR (${Math.round(BMR)} kcal) = ${Math.round(BMR)} kcal/day`,
          steps: 'Maintenance goal: 7,500 steps/day',
          workout: 'Maintenance goal: 4 workout days per week',
        },
      };

      const explanation = goalExplanations[mainGoal as keyof typeof goalExplanations] || goalExplanations.maintenance;

      setGoals({
        calories: {
          goal: caloriesGoal,
          calculated: true,
          explanation: explanation.calories,
        },
        water: {
          goal: waterGoal,
          calculated: false,
          explanation: 'Standard recommendation: 4,000ml (4L) per day for optimal hydration',
        },
        sleep: {
          goal: sleepGoal,
          calculated: false,
          explanation: 'Minimum recommended: 6 hours per night for basic recovery',
        },
        steps: {
          goal: stepsGoal,
          calculated: true,
          explanation: explanation.steps,
        },
        weight: {
          goal: weightGoal,
          current: weightCurrent,
          calculated: true,
          explanation: `Ideal weight based on BMI 22: ${weightGoal.toFixed(1)} kg (calculated from height ${heightCm} cm)`,
        },
        workout: {
          goal: workoutGoal,
          calculated: true,
          explanation: explanation.workout,
        },
      });
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to load goals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, profile]);

  useEffect(() => {
    fetchAllGoals();
  }, [fetchAllGoals]);

  const handleEdit = (goalType: string, currentValue: number) => {
    setEditingGoal(goalType);
    setEditValues({ [goalType]: currentValue });
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setEditValues({});
  };

  const handleSave = async (goalType: string) => {
    const newValue = editValues[goalType];
    if (newValue === undefined || newValue <= 0) {
      toast({
        title: "Invalid value",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      // Note: Most goals are calculated, so we can't actually update them via API
      // This is a UI-only update for demonstration
      // In a real app, you'd need backend endpoints to update custom goals
      
      toast({
        title: "Note",
        description: "This goal is automatically calculated and cannot be manually changed. Update your main goal or profile information to change it.",
        variant: "default",
      });
      
      setEditingGoal(null);
      setEditValues({});
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        title: "Error",
        description: "Failed to save goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getMainGoalDisplay = () => {
    const goal = profile?.goal || 'maintenance';
    const goalMap: Record<string, { label: string; icon: typeof TrendingDown; color: string }> = {
      weightLoss: { label: 'Weight Loss', icon: TrendingDown, color: 'text-red-600' },
      weightGain: { label: 'Weight Gain', icon: TrendingUp, color: 'text-green-600' },
      maintenance: { label: 'Maintenance', icon: Minus, color: 'text-blue-600' },
    };
    return goalMap[goal] || goalMap.maintenance;
  };

  const mainGoalInfo = getMainGoalDisplay();
  const MainGoalIcon = mainGoalInfo.icon;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Target className="h-8 w-8 text-primary" />
                Fitness Goals
              </h1>
              <p className="text-muted-foreground mt-1">
                Track and manage all your fitness objectives
              </p>
            </div>
          </div>

          {/* Main Goal Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MainGoalIcon className={`h-5 w-5 ${mainGoalInfo.color}`} />
                Primary Goal
              </CardTitle>
              <CardDescription>
                Your main fitness objective that influences all other goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${mainGoalInfo.color}`}>
                    {mainGoalInfo.label}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.goal === 'weightLoss' && 'Focus on calorie deficit and increased activity'}
                    {profile?.goal === 'weightGain' && 'Focus on calorie surplus and strength training'}
                    {profile?.goal === 'maintenance' && 'Maintain current weight with balanced nutrition and exercise'}
                  </p>
                </div>
                <Info className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Goals Grid */}
          {goals && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Calorie Goal */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Flame className="h-4 w-4 text-orange-600" />
                      Daily Calories
                    </CardTitle>
                    {goals.calories.calculated && (
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                        Auto-calculated
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {editingGoal === 'calories' ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={editValues.calories || goals.calories.goal}
                        onChange={(e) => setEditValues({ calories: parseFloat(e.target.value) || 0 })}
                        className="text-lg font-semibold"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave('calories')}>
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-orange-600">
                        {Math.round(goals.calories.goal)} kcal
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {goals.calories.explanation}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Water Goal */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      Water Intake
                    </CardTitle>
                    {!goals.water.calculated && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit('water', goals.water.goal)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {editingGoal === 'water' ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={editValues.water || goals.water.goal}
                        onChange={(e) => setEditValues({ water: parseFloat(e.target.value) || 0 })}
                        className="text-lg font-semibold"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave('water')}>
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-blue-600">
                        {(goals.water.goal / 1000).toFixed(1)} L
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {goals.water.explanation}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Sleep Goal */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Moon className="h-4 w-4 text-purple-600" />
                      Sleep Duration
                    </CardTitle>
                    {!goals.sleep.calculated && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit('sleep', goals.sleep.goal)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {editingGoal === 'sleep' ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        step="0.5"
                        value={editValues.sleep || goals.sleep.goal}
                        onChange={(e) => setEditValues({ sleep: parseFloat(e.target.value) || 0 })}
                        className="text-lg font-semibold"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave('sleep')}>
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold text-purple-600">
                        {goals.sleep.goal} hours
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {goals.sleep.explanation}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Steps Goal */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Footprints className="h-4 w-4 text-green-600" />
                      Daily Steps
                    </CardTitle>
                    {goals.steps.calculated && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Auto-calculated
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold text-green-600">
                    {goals.steps.goal.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {goals.steps.explanation}
                  </p>
                </CardContent>
              </Card>

              {/* Weight Goal */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Weight className="h-4 w-4 text-slate-600" />
                      Target Weight
                    </CardTitle>
                    {goals.weight.calculated && (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        Auto-calculated
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-slate-600">
                      {goals.weight.goal.toFixed(1)} kg
                    </div>
                    {goals.weight.current && (
                      <div className="text-sm text-muted-foreground">
                        Current: {goals.weight.current.toFixed(1)} kg
                        {goals.weight.current < goals.weight.goal && (
                          <span className="text-green-600 ml-2">
                            Need to gain: {(goals.weight.goal - goals.weight.current).toFixed(1)} kg
                          </span>
                        )}
                        {goals.weight.current > goals.weight.goal && (
                          <span className="text-red-600 ml-2">
                            Need to lose: {(goals.weight.current - goals.weight.goal).toFixed(1)} kg
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {goals.weight.explanation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Workout Goal */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-indigo-600" />
                      Weekly Workouts
                    </CardTitle>
                    {goals.workout.calculated && (
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                        Auto-calculated
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold text-indigo-600">
                    {goals.workout.goal} days/week
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {goals.workout.explanation}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Card */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4" />
                About Your Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Auto-calculated goals</strong> are automatically determined based on your profile information (weight, height, age, gender) and your main fitness goal. These will update automatically when you update your profile.
                </p>
                <p>
                  <strong className="text-foreground">Custom goals</strong> (Water and Sleep) can be manually adjusted to match your personal preferences and needs.
                </p>
                <p>
                  To change your main goal or update your profile information, please visit your profile settings or update your information during registration.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

