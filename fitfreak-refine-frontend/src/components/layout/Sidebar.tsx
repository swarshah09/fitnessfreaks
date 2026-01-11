import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Activity,
  Target,
  Utensils,
  Droplets,
  Moon,
  Weight,
  Footprints,
  Calculator,
  TrendingUp,
  BookOpen,
  Notebook,
  Hash,
  UserCircle2,
  Users,
  X,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    name: "Dashboard", 
    href: "/dashboard", 
    icon: Home,
    description: "Overview of your fitness journey"
  },
  {
    name: "Workouts", 
    href: "/workouts", 
    icon: Activity,
    description: "Exercise routines and tracking"
  },
  {
    name: "Goals", 
    href: "/goals", 
    icon: Target,
    description: "Set and track your fitness goals"
  },
  {
    name: "Nutrition", 
    href: "/nutrition", 
    icon: Utensils,
    description: "Calorie and meal tracking"
  },
  {
    name: "Water Intake", 
    href: "/water", 
    icon: Droplets,
    description: "Daily hydration tracking"
  },
  {
    name: "Sleep", 
    href: "/sleep", 
    icon: Moon,
    description: "Sleep quality and duration"
  },
  {
    name: "Steps", 
    href: "/steps", 
    icon: Footprints,
    description: "Daily step count tracking"
  },
  {
    name: "Weight", 
    href: "/weight", 
    icon: Weight,
    description: "Weight tracking and trends"
  },
  {
    name: "BMI Calculator", 
    href: "/bmi", 
    icon: Calculator,
    description: "Calculate your BMI"
  },
  {
    name: "Progress", 
    href: "/progress", 
    icon: TrendingUp,
    description: "Track your improvements"
  },
  {
    name: "Recipes", 
    href: "/recipes", 
    icon: Utensils,
    description: "High-protein fitness recipes"
  },
  {
    name: "FitGram", 
    href: "/fitgram", 
    icon: Hash,
    description: "Fitness social feed"
  },
  {
    name: "Daily Activity", 
    href: "/activity", 
    icon: Notebook,
    description: "Log workouts and attendance"
  },
  {
    name: "FitGram Profile", 
    href: "/fitgram/me", 
    icon: UserCircle2,
    description: "Your FitGram profile"
  },
];

const adminNavigation = [
  {
    name: "Users", 
    href: "/admin/users", 
    icon: Users,
    description: "Manage users"
  },
];

export function Sidebar({ className, isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        <item.icon className={cn(
          "h-4 w-4 transition-colors",
          isActive ? "text-primary-foreground" : "text-muted-foreground"
        )} />
        <span className="font-medium">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-72 bg-background border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Navigation</h2>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="md:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto p-4">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>

            <div className="mt-6">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin
              </h3>
              <nav className="space-y-1">
                {adminNavigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="rounded-lg bg-primary/10 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Daily Goal</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Keep pushing towards your fitness goals!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}