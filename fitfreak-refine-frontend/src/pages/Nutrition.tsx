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
import { useProfile } from "@/hooks/useProfile";
import { 
  Plus, 
  Apple, 
  Search, 
  Calendar,
  Target,
  Flame,
  TrendingUp,
  Utensils
} from "lucide-react";
import { api } from "@/integrations/api/client";
import { useAuth } from "@/hooks/useAuth";

interface CalorieEntry {
  item: string;
  date: string;
  quantity: number;
  quantitytype: string;
  calorieIntake: number;
  protein?: number;
  carbs?: number;
}

interface CalorieGoal {
  maxCalorieIntake: number;
}

export default function Nutrition() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calorieEntries, setCalorieEntries] = useState<CalorieEntry[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<CalorieGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isGoalLoading, setIsGoalLoading] = useState(true);

  // Add food form state
  const [foodItem, setFoodItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityType, setQuantityType] = useState("g");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();

  const fetchTodaysCalories = useCallback(async (targetDate: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/calorieintake/getcalorieintakebydate', { date: targetDate });
      if (data?.ok) {
        setCalorieEntries(data.data);
      } else {
        setCalorieEntries([]);
      }
    } catch (error) {
      console.error('Error fetching calories:', error);
      setCalorieEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCalorieGoal = useCallback(async () => {
    try {
      setIsGoalLoading(true);
      const { data } = await api.get('/calorieintake/getgoalcalorieintake');
      if (data?.ok) {
        setCalorieGoal(data.data);
      } else {
        setCalorieGoal(null);
      }
    } catch (error) {
      console.error('Error fetching calorie goal:', error);
      setCalorieGoal(null);
    } finally {
      setIsGoalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCalorieGoal();
    } else {
      setCalorieGoal(null);
      setIsGoalLoading(false);
    }
  }, [isAuthenticated, fetchCalorieGoal]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodaysCalories(selectedDate);
    } else {
      setCalorieEntries([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedDate, fetchTodaysCalories]);

  const addCalorieEntry = async () => {
    if (!foodItem || !quantity) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please sign in to log calories",
        variant: "destructive",
      });
      return;
    }

    const parsedQuantity = parseFloat(quantity);
    if (!parsedQuantity || parsedQuantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);

    try {
      const { data } = await api.post('/calorieintake/addcalorieintake', {
        item: foodItem,
        date: selectedDate,
        quantity: parsedQuantity,
        quantitytype: quantityType,
      });

      if (data?.ok) {
        toast({
          title: "Success",
          description: "Food item added successfully!",
        });
        setFoodItem("");
        setQuantity("");
        fetchTodaysCalories(selectedDate);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to add food item",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Network error while adding food item";
      console.error('Error adding calorie entry:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const totalCalories = calorieEntries.reduce((sum, entry) => sum + entry.calorieIntake, 0);
  const totalProtein = calorieEntries.reduce((sum, entry) => sum + (entry.protein ?? 0), 0);
  const totalCarbs = calorieEntries.reduce((sum, entry) => sum + (entry.carbs ?? 0), 0);

  // Macro goals derived from user's profile (rough defaults if missing)
  const getMacroGoals = () => {
    const weightKg = profile?.weight || 70;
    const goal = profile?.goal || "maintenance";
    const activity = profile?.activity_level || profile?.activityLevel || "moderate";

    // Protein multipliers (g/kg)
    const baseProtein =
      goal === "weightLoss" ? 1.8 :
      goal === "weightGain" ? 2.0 : 1.6;

    const activityBump =
      activity === "sedentary" ? 0 :
      activity === "light" ? 0.1 :
      activity === "moderate" ? 0.2 :
      activity === "active" ? 0.3 : 0.35;

    const proteinGoal = Math.round((baseProtein + activityBump) * weightKg);

    // Carbs multipliers (g/kg)
    const baseCarbs =
      goal === "weightLoss" ? 3.0 :
      goal === "weightGain" ? 5.0 : 4.0;

    const carbActivityBump =
      activity === "sedentary" ? 0 :
      activity === "light" ? 0.25 :
      activity === "moderate" ? 0.5 :
      activity === "active" ? 0.75 : 1.0;

    const carbsGoal = Math.round((baseCarbs + carbActivityBump) * weightKg);

    return { proteinGoal, carbsGoal };
  };

  const { proteinGoal, carbsGoal } = getMacroGoals();

  const calorieProgress = calorieGoal ? (totalCalories / calorieGoal.maxCalorieIntake) * 100 : 0;
  const proteinProgress = proteinGoal > 0 ? (totalProtein / proteinGoal) * 100 : 0;
  const carbsProgress = carbsGoal > 0 ? (totalCarbs / carbsGoal) * 100 : 0;
  const remainingCalories = calorieGoal ? calorieGoal.maxCalorieIntake - totalCalories : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">Nutrition Tracking</h1>
              <p className="text-muted-foreground">
                Monitor your daily calorie intake and maintain a healthy diet
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

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Flame className="h-5 w-5" />
                  Calories Consumed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-800">{totalCalories}</div>
                <p className="text-sm text-orange-600">kcal today</p>
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
                  {isGoalLoading ? '—' : calorieGoal?.maxCalorieIntake || 0}
                </div>
                <p className="text-sm text-blue-600">kcal target</p>
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
                  {remainingCalories > 0 ? remainingCalories : 0}
                </div>
                <p className="text-sm text-green-600">kcal left</p>
              </CardContent>
            </Card>
          </div>

          {/* Protein & Carbs Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <Target className="h-5 w-5" />
                  Protein Intake
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-3xl font-bold text-indigo-800">
                  {totalProtein.toFixed(1)} g
                </div>
                <p className="text-sm text-indigo-600">
                  Goal: {proteinGoal} g
                </p>
                <Progress value={Math.min(proteinProgress, 100)} className="h-3" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <Target className="h-5 w-5" />
                  Carbs Intake
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-3xl font-bold text-emerald-800">
                  {totalCarbs.toFixed(1)} g
                </div>
                <p className="text-sm text-emerald-600">
                  Goal: {carbsGoal} g
                </p>
                <Progress value={Math.min(carbsProgress, 100)} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {calorieGoal && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Progress</span>
                    <span>{Math.round(calorieProgress)}%</span>
                  </div>
                  <Progress value={calorieProgress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 kcal</span>
                    <span>{calorieGoal.maxCalorieIntake} kcal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Food Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Food Item
                </CardTitle>
                <CardDescription>
                  Log your meals and track calories automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="food-item">Food Item</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="food-item"
                      placeholder="e.g., Apple, Chicken breast, Rice"
                      value={foodItem}
                      onChange={(e) => setFoodItem(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="100"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={quantityType} onValueChange={setQuantityType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="ml">Milliliters (ml)</SelectItem>
                        <SelectItem value="l">Liters (l)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={addCalorieEntry}
                  disabled={isAdding}
                  className="w-full bg-primary text-white hover:opacity-90"
                >
                  {isAdding ? "Adding..." : "Add Food Item"}
                </Button>
              </CardContent>
            </Card>

            {/* Today's Meals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Today's Meals
                </CardTitle>
                <CardDescription>
                  Your food intake for {new Date(selectedDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : calorieEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Apple className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No meals logged</h3>
                    <p className="text-muted-foreground">
                      Start adding your food items to track calories
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {calorieEntries.map((entry, index) => (
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
                                {entry.protein.toFixed(1)} g protein
                              </span>
                            )}
                            {entry.carbs !== undefined && (
                              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                {entry.carbs.toFixed(1)} g carbs
                              </span>
                            )}
                        </div>
                        </div>
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