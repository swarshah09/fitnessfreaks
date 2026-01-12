import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  User, 
  LogOut,
  Menu,
  Dumbbell,
  Hash
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const searchItems = useMemo(() => [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Workouts", path: "/workouts", tags: ["exercise", "training", "start workout", "start-workout"] },
    { label: "Start Workout", path: "/start-workout", tags: ["quick", "timer", "instant"] },
    { label: "Nutrition", path: "/nutrition", tags: ["calories", "food", "meals"] },
    { label: "Water Intake", path: "/water", tags: ["hydration"] },
    { label: "Sleep", path: "/sleep" },
    { label: "Steps", path: "/steps" },
    { label: "Weight", path: "/weight" },
    { label: "BMI Calculator", path: "/bmi", tags: ["bmi"] },
    { label: "Progress", path: "/progress", tags: ["analytics", "report"] },
    { label: "Goals", path: "/goals" },
    { label: "Daily Activity", path: "/activity", tags: ["attendance", "streak"] },
    { label: "Recipes", path: "/recipes", tags: ["food", "meal", "protein"] },
    { label: "Profile", path: "/profile", tags: ["account"] },
  ], []);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchItems.filter(item => {
      const haystack = [item.label, ...(item.tags || [])].join(" ").toLowerCase();
      return haystack.includes(q);
    }).slice(0, 6);
  }, [searchItems, searchQuery]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const first = filteredResults[0];
    if (first) {
      navigate(first.path);
      setSearchQuery("");
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background sticky top-0 z-50">
      <div className="flex h-full items-center justify-between px-6 md:px-8 lg:px-12">
        {/* Left Section - Logo & Menu */}
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 bg-card px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <img 
              src={logo} 
              alt="Fitness Freak" 
              className="h-8 w-auto object-contain"
            />
          </button>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form className="relative w-full" onSubmit={handleSearchSubmit}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workouts, nutrition, progress..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
            {filteredResults.length > 0 && (
              <div className="absolute mt-1 w-full rounded-md border bg-popover shadow-lg z-50">
                {filteredResults.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-accent"
                    onClick={() => {
                      navigate(item.path);
                      setSearchQuery("");
                    }}
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.tags && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {item.tags[0] || ""}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={() => navigate('/fitgram')}
          >
            <Hash className="h-4 w-4 mr-1" />
            FitGram
          </Button>
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {
              const first = filteredResults[0];
              if (first) {
                navigate(first.path);
                setSearchQuery("");
              }
            }}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground">
              3
            </span>
          </Button>

          {/* User Profile */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || ""} alt={user.email} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                    {user.email && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/fitgram/me')}>
                  <Hash className="mr-2 h-4 w-4" />
                  <span>FitGram Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}