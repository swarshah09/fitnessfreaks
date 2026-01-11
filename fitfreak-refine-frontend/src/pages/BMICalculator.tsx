import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { 
  Calculator, 
  Scale, 
  Ruler, 
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Info
} from "lucide-react";

interface BMICategory {
  range: string;
  category: string;
  color: string;
  description: string;
}

const bmiCategories: BMICategory[] = [
  { range: "< 18.5", category: "Underweight", color: "text-blue-600", description: "You may need to gain some weight" },
  { range: "18.5 - 24.9", category: "Normal", color: "text-green-600", description: "You have a healthy weight" },
  { range: "25.0 - 29.9", category: "Overweight", color: "text-yellow-600", description: "You may need to lose some weight" },
  { range: "≥ 30.0", category: "Obese", color: "text-red-600", description: "Consider consulting a healthcare provider" },
];

export default function BMICalculator() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBMI] = useState<number | null>(null);
  const [category, setCategory] = useState<BMICategory | null>(null);
  const { user } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    // Pre-fill with user profile data if available
    if (profile) {
      if (profile.height) {
        setHeight(profile.height.toString());
      }
      if (profile.weight) {
        setWeight(profile.weight.toString());
      }
    }
  }, [profile]);

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBMI(calculatedBMI);
      
      // Determine category
      let selectedCategory: BMICategory;
      if (calculatedBMI < 18.5) {
        selectedCategory = bmiCategories[0];
      } else if (calculatedBMI < 25) {
        selectedCategory = bmiCategories[1];
      } else if (calculatedBMI < 30) {
        selectedCategory = bmiCategories[2];
      } else {
        selectedCategory = bmiCategories[3];
      }
      setCategory(selectedCategory);
    }
  };

  const getBMIProgress = (bmiValue: number) => {
    // Map BMI to progress bar (0-100)
    // Underweight: 0-25, Normal: 25-50, Overweight: 50-75, Obese: 75-100
    if (bmiValue < 18.5) return (bmiValue / 18.5) * 25;
    if (bmiValue < 25) return 25 + ((bmiValue - 18.5) / 6.5) * 25;
    if (bmiValue < 30) return 50 + ((bmiValue - 25) / 5) * 25;
    return Math.min(75 + ((bmiValue - 30) / 10) * 25, 100);
  };

  const getIdealWeightRange = () => {
    if (!height) return null;
    const heightInMeters = parseFloat(height) / 100;
    const minWeight = 18.5 * heightInMeters * heightInMeters;
    const maxWeight = 24.9 * heightInMeters * heightInMeters;
    return { min: minWeight.toFixed(1), max: maxWeight.toFixed(1) };
  };

  const idealWeightRange = getIdealWeightRange();

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">BMI Calculator</h1>
              <p className="text-muted-foreground">
                Calculate your Body Mass Index and understand your health status
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  BMI Calculator
                </CardTitle>
                <CardDescription>
                  Enter your height and weight to calculate your BMI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="height"
                        type="number"
                        placeholder="175"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={calculateBMI}
                  disabled={!height || !weight}
                  className="w-full bg-primary text-white hover:opacity-90"
                >
                  Calculate BMI
                </Button>

                {/* BMI Result */}
                {bmi && category && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{bmi.toFixed(1)}</div>
                      <div className={`text-lg font-semibold ${category.color}`}>
                        {category.category}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    </div>

                    {/* BMI Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Underweight</span>
                        <span>Normal</span>
                        <span>Overweight</span>
                        <span>Obese</span>
                      </div>
                      <Progress value={getBMIProgress(bmi)} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                        <span>35+</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ideal Weight Range */}
                {idealWeightRange && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-800">Ideal Weight Range</span>
                      </div>
                      <p className="text-green-700">
                        {idealWeightRange.min} - {idealWeightRange.max} kg
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Based on normal BMI range (18.5 - 24.9)
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* BMI Categories Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  BMI Categories
                </CardTitle>
                <CardDescription>
                  Understanding BMI ranges and what they mean
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bmiCategories.map((cat, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      category?.category === cat.category 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${cat.color}`}>
                        {cat.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {cat.range}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                ))}

                {/* Health Tips */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Health Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• BMI is a screening tool, not a diagnostic tool</li>
                    <li>• Consult healthcare providers for personalized advice</li>
                    <li>• Consider factors like muscle mass and bone density</li>
                    <li>• Focus on overall health, not just weight</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Health Metrics */}
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Your Health Journey</CardTitle>
                <CardDescription>
                  Track your progress with personalized insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="mx-auto h-8 w-8 text-green-600 mb-2" />
                    <div className="text-2xl font-bold">
                      {profile.goal === 'weight_loss' ? 'Lose Weight' : 
                       profile.goal === 'muscle_gain' ? 'Gain Muscle' : 
                       profile.goal === 'endurance' ? 'Build Endurance' : 'Maintain'}
                    </div>
                    <p className="text-sm text-muted-foreground">Current Goal</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Scale className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">
                      {profile.weight || 'N/A'} kg
                    </div>
                    <p className="text-sm text-muted-foreground">Current Weight</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Ruler className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">
                      {profile.height || 'N/A'} cm
                    </div>
                    <p className="text-sm text-muted-foreground">Height</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}