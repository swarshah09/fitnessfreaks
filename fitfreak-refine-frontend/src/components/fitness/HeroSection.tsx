import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Play,
  ArrowRight 
} from "lucide-react";
import heroImage from "@/assets/fitness-hero.jpg";

interface HeroSectionProps {
  user?: {
    name: string;
    totalWorkouts?: number;
    weeklyGoal?: number;
    currentStreak?: number;
  };
}

export function HeroSection({ user }: HeroSectionProps) {
  const quickStats = [
    {
      label: "Workouts",
      value: user?.totalWorkouts || 0,
      icon: Activity,
      color: "text-primary"
    },
    {
      label: "Weekly Goal",
      value: `${user?.weeklyGoal || 5}/5`,
      icon: Target,
      color: "text-success"
    },
    {
      label: "Streak",
      value: `${user?.currentStreak || 0} days`,
      icon: TrendingUp,
      color: "text-warning"
    }
  ];

  return (
    <div className="relative min-h-[400px] md:min-h-[500px] rounded-2xl overflow-hidden animate-fade-in">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-12">
        <div className="max-w-2xl">
          {/* Greeting */}
          <div className="mb-6 animate-slide-up">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              Welcome back{user?.name && `, ${user.name}`}
              <span className="text-primary">!</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Ready to crush your fitness goals today?
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 animate-scale-in">
            {quickStats.map((stat, index) => (
              <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-lg md:text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <Button size="lg" className="group">
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Workout
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button size="lg" variant="outline" className="bg-card/50 backdrop-blur-sm">
              View Progress
            </Button>
          </div>

          {/* Motivational Quote */}
          <div className="mt-8 p-4 rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20 animate-fade-in">
            <p className="text-sm italic text-foreground/80">
              "The only bad workout is the one that didn't happen."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}