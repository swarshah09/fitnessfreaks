import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeroSection } from "@/components/fitness/HeroSection";
import { MetricCard } from "@/components/fitness/MetricCard";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user: authUser } = useAuth();
  const { profile } = useProfile();

  // Transform auth user data for hero section
  const user = authUser && profile ? {
    name: profile.name || authUser.email,
    email: authUser.email,
    avatar: "",
    totalWorkouts: 47, // Will be replaced with real data from backend
    weeklyGoal: 5,
    currentStreak: 12,
  } : null;

  // Mock fitness metrics - in real app this would come from your APIs
  const fitnessMetrics = [
    {
      title: "Calories Today",
      value: 1847,
      target: 2200,
      unit: "kcal",
      icon: Flame,
      trend: "up" as const,
      trendValue: "+12% from yesterday",
      progress: 84,
      color: "warning" as const,
    },
    {
      title: "Water Intake",
      value: 6,
      target: 8,
      unit: "glasses",
      icon: Droplets,
      trend: "up" as const,
      trendValue: "2 more to goal",
      progress: 75,
      color: "info" as const,
    },
    {
      title: "Sleep Last Night",
      value: "7.5",
      target: "8",
      unit: "hours",
      icon: Moon,
      trend: "neutral" as const,
      trendValue: "Good quality",
      progress: 94,
      color: "primary" as const,
    },
    {
      title: "Steps Today",
      value: "8,247",
      target: "10,000",
      unit: "steps",
      icon: Footprints,
      trend: "up" as const,
      trendValue: "+1,203 from yesterday",
      progress: 82,
      color: "success" as const,
    },
    {
      title: "Current Weight",
      value: 72.5,
      target: 70,
      unit: "kg",
      icon: Weight,
      trend: "down" as const,
      trendValue: "-0.5kg this week",
      progress: 85,
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
              {fitnessMetrics.map((metric, index) => (
                <MetricCard
                  key={metric.title}
                  {...metric}
                  className="hover:scale-105 transition-transform duration-200"
                  onAdd={() => console.log(`Add ${metric.title}`)}
                  onView={() => console.log(`View ${metric.title}`)}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Quick Workout"
              value="Start Now"
              icon={Activity}
              color="primary"
              onAdd={() => console.log("Start workout")}
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
              onAdd={() => console.log("Log meal")}
            >
              <p className="text-xs text-muted-foreground">
                Track your nutrition and stay on target
              </p>
            </MetricCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
