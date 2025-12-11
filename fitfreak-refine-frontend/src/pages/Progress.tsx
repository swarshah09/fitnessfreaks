import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Flame,
  Droplets,
  Moon,
  Footprints,
  Weight,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { api } from "@/integrations/api/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  date: string;
  calories?: number;
  water?: number;
  sleep?: number;
  steps?: number;
  weight?: number;
  workouts?: number;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

export default function Progress() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [stats, setStats] = useState({
    calories: { current: 0, average: 0, change: 0 },
    water: { current: 0, average: 0, change: 0 },
    sleep: { current: 0, average: 0, change: 0 },
    steps: { current: 0, average: 0, change: 0 },
    weight: { current: 0, average: 0, change: 0 },
    workouts: { current: 0, average: 0, change: 0 },
  });

  const processDataForTimeRange = useCallback((entries: any[], metric: string, timeRange: TimeRange): ChartDataPoint[] => {
    const now = new Date();
    const dataMap = new Map<string, any>();

    let daysToFetch = 7;
    if (timeRange === 'weekly') daysToFetch = 28; // 4 weeks
    if (timeRange === 'monthly') daysToFetch = 180; // ~6 months

    // Initialize all dates in range
    for (let i = daysToFetch - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      if (timeRange === 'daily') {
        dataMap.set(dateKey, { date: dateKey });
      } else if (timeRange === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        if (!dataMap.has(weekKey)) {
          dataMap.set(weekKey, { date: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` });
        }
      } else if (timeRange === 'monthly') {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!dataMap.has(monthKey)) {
          dataMap.set(monthKey, { date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) });
        }
      }
    }

    // Process entries
    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      let key: string;
      
      if (timeRange === 'daily') {
        key = entryDate.toISOString().split('T')[0];
      } else if (timeRange === 'weekly') {
        const weekStart = new Date(entryDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
      }

      if (dataMap.has(key)) {
        const dataPoint = dataMap.get(key);
        
        if (metric === 'calories') {
          dataPoint.calories = (dataPoint.calories || 0) + (entry.calorieIntake || 0);
        } else if (metric === 'water') {
          dataPoint.water = (dataPoint.water || 0) + (entry.amountInMilliliters || 0);
        } else if (metric === 'sleep') {
          dataPoint.sleep = (dataPoint.sleep || 0) + (entry.durationInHrs || 0);
        } else if (metric === 'steps') {
          dataPoint.steps = (dataPoint.steps || 0) + (entry.steps || 0);
        } else if (metric === 'weight') {
          // For weight, take the latest entry for that period
          if (!dataPoint.weight || new Date(entry.date) > new Date(dataPoint.weightDate || 0)) {
            dataPoint.weight = entry.weight;
            dataPoint.weightDate = entry.date;
          }
        } else if (metric === 'workouts') {
          dataPoint.workouts = (dataPoint.workouts || 0) + 1;
        }
      }
    });

    return Array.from(dataMap.values());
  }, []);

  const fetchProgressData = useCallback(async (range: TimeRange) => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      let limit = 7;
      if (range === 'weekly') limit = 28;
      if (range === 'monthly') limit = 180;

      // Fetch all metrics
      const [caloriesRes, waterRes, sleepRes, stepsRes, weightRes, workoutsRes] = await Promise.all([
        api.post('/calorieintake/getcalorieintakebylimit', { limit }).catch(() => ({ data: { ok: false, data: [] } })),
        api.post('/watertrack/getwaterbylimit', { limit }).catch(() => ({ data: { ok: false, data: [] } })),
        api.post('/sleeptrack/getsleepbylimit', { limit }).catch(() => ({ data: { ok: false, data: [] } })),
        api.post('/steptrack/getstepsbylimit', { limit }).catch(() => ({ data: { ok: false, data: [] } })),
        api.post('/weighttrack/getweightbylimit', { limit }).catch(() => ({ data: { ok: false, data: [] } })),
        api.post('/workouttrack/getworkoutsbylimit', { limit }).catch(() => ({ data: { ok: false, data: [] } })),
      ]);

      const calories = caloriesRes.data?.ok ? caloriesRes.data.data || [] : [];
      const water = waterRes.data?.ok ? waterRes.data.data || [] : [];
      const sleep = sleepRes.data?.ok ? sleepRes.data.data || [] : [];
      const steps = stepsRes.data?.ok ? stepsRes.data.data || [] : [];
      const weight = weightRes.data?.ok ? weightRes.data.data || [] : [];
      const workouts = workoutsRes.data?.ok ? workoutsRes.data.data || [] : [];

      // Process data for charts
      const caloriesData = processDataForTimeRange(calories, 'calories', range);
      const waterData = processDataForTimeRange(water, 'water', range);
      const sleepData = processDataForTimeRange(sleep, 'sleep', range);
      const stepsData = processDataForTimeRange(steps, 'steps', range);
      const weightData = processDataForTimeRange(weight, 'weight', range);
      const workoutsData = processDataForTimeRange(workouts, 'workouts', range);

      // Merge all data by date
      const mergedData: ChartDataPoint[] = [];
      const allDates = new Set([
        ...caloriesData.map(d => d.date),
        ...waterData.map(d => d.date),
        ...sleepData.map(d => d.date),
        ...stepsData.map(d => d.date),
        ...weightData.map(d => d.date),
        ...workoutsData.map(d => d.date),
      ]);

      allDates.forEach(date => {
        const point: ChartDataPoint = { date };
        const cal = caloriesData.find(d => d.date === date);
        const wat = waterData.find(d => d.date === date);
        const slp = sleepData.find(d => d.date === date);
        const stp = stepsData.find(d => d.date === date);
        const wgt = weightData.find(d => d.date === date);
        const wrk = workoutsData.find(d => d.date === date);

        if (cal) point.calories = cal.calories;
        if (wat) point.water = wat.water;
        if (slp) point.sleep = slp.sleep;
        if (stp) point.steps = stp.steps;
        if (wgt) point.weight = wgt.weight;
        if (wrk) point.workouts = wrk.workouts;

        mergedData.push(point);
      });

      mergedData.sort((a, b) => a.date.localeCompare(b.date));
      setChartData(mergedData);

      // Calculate statistics
      const calculateStats = (values: number[]) => {
        if (values.length === 0) return { current: 0, average: 0, change: 0 };
        const filtered = values.filter(v => v > 0);
        if (filtered.length === 0) return { current: 0, average: 0, change: 0 };
        
        const current = filtered[filtered.length - 1] || 0;
        const average = filtered.reduce((a, b) => a + b, 0) / filtered.length;
        const previous = filtered.length > 1 ? filtered[filtered.length - 2] : current;
        const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

        return { current, average, change };
      };

      setStats({
        calories: calculateStats(mergedData.map(d => d.calories || 0)),
        water: calculateStats(mergedData.map(d => d.water || 0)),
        sleep: calculateStats(mergedData.map(d => d.sleep || 0)),
        steps: calculateStats(mergedData.map(d => d.steps || 0)),
        weight: calculateStats(mergedData.map(d => d.weight || 0)),
        workouts: calculateStats(mergedData.map(d => d.workouts || 0)),
      });

    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, processDataForTimeRange]);

  useEffect(() => {
    fetchProgressData(timeRange);
  }, [timeRange, fetchProgressData]);

  const handleDownloadPdf = () => {
    const summaryDate = new Date().toLocaleString();
    const rangeLabel =
      timeRange === "daily"
        ? "Daily (7 days)"
        : timeRange === "weekly"
        ? "Weekly (4 weeks)"
        : "Monthly (6 months)";

    const latest = (key: keyof typeof stats) => stats[key].current.toFixed(1);
    const change = (key: keyof typeof stats) => stats[key].change.toFixed(1);

    const html = `
      <html>
        <head>
          <title>Fitness Progress Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
            h1 { margin-bottom: 4px; }
            h2 { margin: 16px 0 8px; }
            .subtitle { color: #64748b; margin-bottom: 16px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
            .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; background: #f8fafc; }
            .label { font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; }
            .value { font-size: 20px; font-weight: 700; margin: 4px 0; }
            .change { font-size: 12px; color: #0ea5e9; }
            .section { margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <h1>Fitness Progress Report</h1>
          <div class="subtitle">Range: ${rangeLabel} • Generated: ${summaryDate}</div>

          <h2>Key Metrics</h2>
          <div class="grid">
            <div class="card"><div class="label">Calories</div><div class="value">${latest("calories")} kcal</div><div class="change">Δ ${change("calories")}%</div></div>
            <div class="card"><div class="label">Water</div><div class="value">${latest("water")} ml</div><div class="change">Δ ${change("water")}%</div></div>
            <div class="card"><div class="label">Sleep</div><div class="value">${latest("sleep")} hrs</div><div class="change">Δ ${change("sleep")}%</div></div>
            <div class="card"><div class="label">Steps</div><div class="value">${latest("steps")}</div><div class="change">Δ ${change("steps")}%</div></div>
            <div class="card"><div class="label">Weight</div><div class="value">${latest("weight")} kg</div><div class="change">Δ ${change("weight")}%</div></div>
            <div class="card"><div class="label">Workouts</div><div class="value">${latest("workouts")}</div><div class="change">Δ ${change("workouts")}%</div></div>
          </div>

          <h2>Motivation</h2>
          <div class="card">
            Keep showing up — consistency compounds. Small daily wins add up to big changes.
          </div>
        </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=900,height=1200");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  const StatCard = ({ 
    title, 
    icon: Icon, 
    value, 
    unit, 
    average, 
    change, 
    color 
  }: { 
    title: string; 
    icon: any; 
    value: number; 
    unit: string; 
    average: number; 
    change: number;
    color: string;
  }) => {
    const isPositive = change >= 0;
    const displayValue = value > 0 ? value.toFixed(1) : '—';
    const displayAvg = average > 0 ? average.toFixed(1) : '—';
    
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Icon className={`h-4 w-4 ${color}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">
            {displayValue} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Avg: {displayAvg} {unit}</span>
            {change !== 0 && (
              <span className={cn(
                "flex items-center gap-1",
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(change).toFixed(1)}%
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const ChartCard = ({ 
    title, 
    dataKey, 
    color, 
    unit = '',
    formatter = (v: any) => v 
  }: { 
    title: string; 
    dataKey: keyof ChartDataPoint; 
    color: string; 
    unit?: string;
    formatter?: (value: any) => string;
  }) => {
    const data = chartData.filter(d => d[dataKey] !== undefined);
    
    if (data.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>No data available</CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {timeRange === 'daily' && 'Last 7 days'}
            {timeRange === 'weekly' && 'Last 4 weeks'}
            {timeRange === 'monthly' && 'Last 6 months'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={timeRange === 'monthly' ? -45 : 0}
                textAnchor={timeRange === 'monthly' ? 'end' : 'middle'}
                height={timeRange === 'monthly' ? 80 : 30}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any) => [`${formatter(value)} ${unit}`, title]}
                labelStyle={{ color: '#000' }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey as string} 
                stroke={color} 
                fill={color}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                Progress Tracking
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor your fitness journey with detailed analytics
              </p>
            </div>
            <Button variant="outline" onClick={handleDownloadPdf}>
              Download PDF Report
            </Button>
          </div>

          {/* Time Range Selector */}
          <Card>
            <CardContent className="pt-6">
              <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Daily (7 days)</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly (4 weeks)</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly (6 months)</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Calories"
              icon={Flame}
              value={stats.calories.current}
              unit="kcal"
              average={stats.calories.average}
              change={stats.calories.change}
              color="text-orange-600"
            />
            <StatCard
              title="Water Intake"
              icon={Droplets}
              value={stats.water.current / 1000}
              unit="L"
              average={stats.water.average / 1000}
              change={stats.water.change}
              color="text-blue-600"
            />
            <StatCard
              title="Sleep"
              icon={Moon}
              value={stats.sleep.current}
              unit="hours"
              average={stats.sleep.average}
              change={stats.sleep.change}
              color="text-purple-600"
            />
            <StatCard
              title="Steps"
              icon={Footprints}
              value={stats.steps.current}
              unit="steps"
              average={stats.steps.average}
              change={stats.steps.change}
              color="text-green-600"
            />
            <StatCard
              title="Weight"
              icon={Weight}
              value={stats.weight.current}
              unit="kg"
              average={stats.weight.average}
              change={stats.weight.change}
              color="text-slate-600"
            />
            <StatCard
              title="Workouts"
              icon={Activity}
              value={stats.workouts.current}
              unit="sessions"
              average={stats.workouts.average}
              change={stats.workouts.change}
              color="text-indigo-600"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Calorie Intake"
              dataKey="calories"
              color="#F59E0B"
              unit="kcal"
              formatter={(v) => Math.round(v).toLocaleString()}
            />
            <ChartCard
              title="Water Intake"
              dataKey="water"
              color="#3B82F6"
              unit="L"
              formatter={(v) => (v / 1000).toFixed(1)}
            />
            <ChartCard
              title="Sleep Duration"
              dataKey="sleep"
              color="#8B5CF6"
              unit="hours"
              formatter={(v) => v.toFixed(1)}
            />
            <ChartCard
              title="Daily Steps"
              dataKey="steps"
              color="#10B981"
              unit="steps"
              formatter={(v) => Math.round(v).toLocaleString()}
            />
            <ChartCard
              title="Weight Trend"
              dataKey="weight"
              color="#64748B"
              unit="kg"
              formatter={(v) => v.toFixed(1)}
            />
            <ChartCard
              title="Workout Sessions"
              dataKey="workouts"
              color="#6366F1"
              unit="sessions"
              formatter={(v) => Math.round(v).toString()}
            />
          </div>

          {/* Combined Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>
                Combined view of all metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={timeRange === 'monthly' ? -45 : 0}
                    textAnchor={timeRange === 'monthly' ? 'end' : 'middle'}
                    height={timeRange === 'monthly' ? 80 : 30}
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'calories') return [`${Math.round(value)} kcal`, 'Calories'];
                      if (name === 'water') return [`${(value / 1000).toFixed(1)} L`, 'Water'];
                      if (name === 'sleep') return [`${value.toFixed(1)} hrs`, 'Sleep'];
                      if (name === 'steps') return [`${Math.round(value).toLocaleString()}`, 'Steps'];
                      if (name === 'weight') return [`${value.toFixed(1)} kg`, 'Weight'];
                      if (name === 'workouts') return [`${Math.round(value)}`, 'Workouts'];
                      return [value, name];
                    }}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={false}
                    name="Calories (kcal)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="water" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                    name="Water (L)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="sleep" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={false}
                    name="Sleep (hrs)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="steps" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={false}
                    name="Steps"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#64748B" 
                    strokeWidth={2}
                    dot={false}
                    name="Weight (kg)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="workouts" 
                    stroke="#6366F1" 
                    strokeWidth={2}
                    dot={false}
                    name="Workouts"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

