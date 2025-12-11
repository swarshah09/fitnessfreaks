import { useMemo } from "react";
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
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  user?: {
    name: string;
    totalWorkouts?: number;
    weeklyGoal?: number;
    currentStreak?: number;
  };
}

export function HeroSection({ user }: HeroSectionProps) {
  const navigate = useNavigate();
  const quotes = useMemo(
    () => [
      "The only bad workout is the one that didn’t happen.",
      "One rep at a time, one day at a time.",
      "Discipline beats motivation.",
      "Progress, not perfection.",
      "You don’t have to be extreme, just consistent.",
      "Small steps add up to big changes.",
      "Stronger than your excuses.",
      "Show up. The rest will follow.",
      "Sweat is your fat crying.",
      "Earned, never given.",
      "Push yourself; no one else will do it for you.",
      "Your future self is watching.",
      "You are one workout away from a good mood.",
      "Hustle for that muscle.",
      "Results happen over time, not overnight.",
      "If it doesn’t challenge you, it doesn’t change you.",
      "Stop wishing, start doing.",
      "Pain is temporary. Pride is forever.",
      "Don’t stop when you’re tired. Stop when you’re done.",
      "Make yourself a priority.",
      "Wake up. Work out. Look hot.",
      "Excuses don’t burn calories.",
      "Be stronger than your strongest excuse.",
      "Your body can stand almost anything. It’s your mind you have to convince.",
      "Fall in love with the process.",
      "Better sore than sorry.",
      "Champions train, losers complain.",
      "Your pace is perfect if you’re moving forward.",
      "Start now. Get better today. Repeat tomorrow.",
      "Prove yourself to yourself.",
      "Sweat now, shine later.",
      "Train insane or remain the same.",
      "Strength comes from doing what you thought you couldn’t.",
      "No shortcuts. Just hard work.",
      "Every rep counts.",
      "Be the hardest worker in the room.",
      "Consistency is a superpower.",
      "Win the day.",
      "Success is the sum of small efforts repeated daily.",
      "Nothing changes if nothing changes.",
      "Don’t count the days, make the days count.",
      "Your only limit is you.",
      "Do something today your future self will thank you for.",
      "Feel the burn and love it.",
      "One hour a day is 4% of your day. Use it.",
      "Great things never come from comfort zones.",
      "Start where you are. Use what you have. Do what you can.",
      "Action cures fear.",
      "You are stronger than you think.",
      "Make progress your habit.",
      "Outwork yesterday.",
      "Move with purpose.",
      "Energy and persistence conquer all things.",
      "Sweat is magic. Cover yourself in it daily.",
      "A little progress each day adds up to big results.",
      "Dream. Plan. Do.",
      "Lift heavy. Live healthy.",
      "Strive for progress, not perfection.",
      "Fit is not a destination, it’s a way of life.",
      "Get comfortable being uncomfortable.",
      "The body achieves what the mind believes."
    ],
    []
  );
  const quote = useMemo(() => {
    const idx = Math.floor(Math.random() * quotes.length);
    return quotes[idx];
  }, [quotes]);
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
            <Button 
              size="lg" 
              className="group"
              onClick={() => navigate("/start-workout")}
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Workout
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-card/50 backdrop-blur-sm"
              onClick={() => navigate("/progress")}
            >
              View Progress
            </Button>
          </div>

          {/* Motivational Quote */}
          <div className="mt-8 p-4 rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20 animate-fade-in">
            <p className="text-sm italic text-foreground/80">
              “{quote}”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}