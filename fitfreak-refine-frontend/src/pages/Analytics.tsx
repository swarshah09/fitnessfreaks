import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  Flame,
  Droplets,
  Moon,
  Footprints,
  Weight,
  Activity
} from "lucide-react";

interface DailyReport {
  name: string;
  value: number;
  goal: number;
  unit: string;
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dailyReport, setDailyReport] = useState<DailyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDailyReport();
  }, []);

  const fetchDailyReport = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/report/getreport`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.ok) {
        setDailyReport(data.data);
      }
    } catch (error) {
      console.error('Error fetching daily report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for charts - in real app, this would come from your backend
  const weeklyProgress = [
    { day: 'Mon', calories: 1800, water: 6, steps: 8500, sleep: 7 },
    { day: 'Tue', calories: 2100, water: 8, steps: 9200, sleep: 6.5 },
    { day: 'Wed', calories: 1950, water: 7, steps: 10100, sleep: 8 },
    { day: 'Thu', calories: 2200, water: 5, steps: 7800, sleep: 7.5 },
    { day: 'Fri', calories: 1850, water: 9, steps: 11200, sleep: 6 },
    { day: 'Sat', calories: 2050, water: 8, steps: 9800, sleep: 8.5 },
    { day: 'Sun', calories: 1900, water: 7, steps: 8900, sleep: 7.5 },
  ];

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'calorie intake': return Flame;
      case 'water': return Droplets;
      case 'sleep': return Moon;
      case 'steps': return Footprints;
      case 'weight': return Weight;
      case 'workout': return Activity;
      default: return Target;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBadge = (percentage: number) => {
    if (percentage >= 100) return <Badge className="bg-green-100 text-green-800">Achieved ✓</Badge>;
    if (percentage >= 75) return <Badge className="bg-yellow-100 text-yellow-800">Good Progress</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track your progress and analyze your fitness journey
              </p>
            </div>
          </div>

          {/* Today's Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-4" />
                    <div className="h-8 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))
            ) : (
              dailyReport.map((metric, index) => {
                const Icon = getIcon(metric.name);
                const percentage = metric.goal > 0 ? (metric.value / metric.goal) * 100 : 0;
                
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="text-lg">{metric.name}</span>
                        </div>
                        {getProgressBadge(percentage)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-3xl font-bold">
                            {typeof metric.value === 'number' && metric.value % 1 !== 0 
                              ? metric.value.toFixed(1) 
                              : metric.value}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {metric.goal} {metric.unit}
                          </span>
                        </div>
                        <Progress value={Math.min(percentage, 100)} className="h-2" />
                        <div className="flex justify-between mt-1">
                          <span className={`text-sm font-medium ${getProgressColor(percentage)}`}>
                            {percentage.toFixed(0)}%
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {metric.goal > metric.value ? 
                              `${(metric.goal - metric.value).toFixed(0)} ${metric.unit} to go` : 
                              'Goal achieved!'
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Calories Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Calorie Intake
                </CardTitle>
                <CardDescription>
                  Your calorie consumption over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Footprints className="h-5 w-5" />
                  Weekly Steps
                </CardTitle>
                <CardDescription>
                  Your daily step count for the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="steps" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sleep Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Sleep Pattern
                </CardTitle>
                <CardDescription>
                  Your sleep duration throughout the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="sleep" 
                      stroke="#06B6D4" 
                      strokeWidth={3}
                      dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Goal Achievement Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Goal Achievement
                </CardTitle>
                <CardDescription>
                  Today's goal completion status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dailyReport.map((item, index) => ({
                        name: item.name,
                        value: Math.min((item.value / item.goal) * 100, 100),
                        color: COLORS[index % COLORS.length]
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dailyReport.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Summary
              </CardTitle>
              <CardDescription>
                Your fitness achievements this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">5</div>
                  <p className="text-sm text-muted-foreground">Workouts Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">95%</div>
                  <p className="text-sm text-muted-foreground">Average Goal Achievement</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">62,500</div>
                  <p className="text-sm text-muted-foreground">Total Steps</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">7.3</div>
                  <p className="text-sm text-muted-foreground">Avg Sleep (hours)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}