import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  Clock, 
  Activity, 
  Play, 
  Plus,
  Filter,
  Dumbbell,
  Target,
  Zap
} from "lucide-react";
import { api } from "@/integrations/api/client";
import { useAuth } from "@/hooks/useAuth";

interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  imageURL: string;
}

interface Workout {
  _id: string;
  name: string;
  description: string;
  durationInMinutes: number;
  exercises: Exercise[];
  imageURL: string;
  createdAt: string;
}

export default function Workouts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDuration, setFilterDuration] = useState("");
  const { isAuthenticated } = useAuth();

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/workoutplans/workouts');
      if (data?.ok) {
        setWorkouts(data.data);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to fetch workouts",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error while fetching workouts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkouts();
    } else {
      setWorkouts([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchWorkouts]);

  const startWorkout = async (workoutId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please sign in to log workouts.",
        variant: "destructive",
      });
      return;
    }

    try {
      const workout = workouts.find((w) => w._id === workoutId);
      const { data } = await api.post('/workouttrack/addworkoutentry', {
        date: new Date().toISOString(),
        exercise: workout?.name || "Workout",
        durationInMinutes: workout?.durationInMinutes || 30,
      });

      if (data?.ok) {
        toast({
          title: "Success",
          description: "Workout started and logged!",
        });
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to start workout",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error while starting workout",
        variant: "destructive",
      });
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDuration = !filterDuration || 
              (filterDuration === "short" && workout.durationInMinutes <= 30) ||
      (filterDuration === "medium" && workout.durationInMinutes > 30 && workout.durationInMinutes <= 60) ||
      (filterDuration === "long" && workout.durationInMinutes > 60);
    
    return matchesSearch && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Workout Library</h1>
                <p className="text-muted-foreground">
                  Choose from our collection of professional workout plans
                </p>
              </div>
              <Button className="bg-gradient-primary text-white hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Create Custom
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workouts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterDuration} onValueChange={setFilterDuration}>
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Durations</SelectItem>
                    <SelectItem value="short">Short (≤30 min)</SelectItem>
                    <SelectItem value="medium">Medium (31-60 min)</SelectItem>
                    <SelectItem value="long">Long (&gt;60 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Workouts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredWorkouts.length === 0 ? (
            <Card className="p-12 text-center">
              <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No workouts found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterDuration 
                  ? "Try adjusting your search or filters" 
                  : "No workouts available at the moment"}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkouts.map((workout) => (
                <Card key={workout._id} className="group hover:shadow-elegant transition-all duration-300 hover:scale-105">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {workout.imageURL ? (
                      <img
                        src={workout.imageURL}
                        alt={workout.name}
                        className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-48 bg-gradient-primary flex items-center justify-center">
                        <Dumbbell className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        <Clock className="mr-1 h-3 w-3" />
                        {workout.durationInMinutes} min
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">{workout.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {workout.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        <span>{workout.exercises.length} exercises</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>All levels</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => startWorkout(workout._id)}
                        className="flex-1 bg-gradient-primary text-white hover:opacity-90"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Workout
                      </Button>
                      <Button variant="outline" size="icon">
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}