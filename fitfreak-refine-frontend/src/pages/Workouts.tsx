import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  Activity, 
  Target,
  Dumbbell,
  AlertTriangle,
  Play,
  Image as ImageIcon,
  Video,
  Info,
  X,
} from "lucide-react";
import { exercisesByMuscleGroup, type Exercise } from "@/data/exercises";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/integrations/api/client";
import { toast } from "@/hooks/use-toast";

export default function Workouts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const { isAuthenticated } = useAuth();

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDialogOpen(true);
  };

  const startExercise = async (exercise: Exercise) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please sign in to log exercises.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data } = await api.post('/workouttrack/addworkoutentry', {
        date: new Date().toISOString(),
        exercise: exercise.name,
        durationInMinutes: 30, // Default duration
      });

      if (data?.ok) {
        toast({
          title: "Success",
          description: `${exercise.name} logged successfully!`,
        });
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: data?.message || "Failed to log exercise",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error while logging exercise",
        variant: "destructive",
      });
    }
  };

  const filteredGroups = exercisesByMuscleGroup.map(group => ({
    ...group,
    exercises: group.exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           exercise.muscleGroups.some(mg => mg.toLowerCase().includes(searchQuery.toLowerCase()));
    
      const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesDifficulty;
    })
  })).filter(group => group.exercises.length > 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => handleExerciseClick(exercise)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        {exercise.imageUrl ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Dumbbell className="h-12 w-12 text-primary/50" />
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{exercise.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {exercise.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {exercise.muscleGroups.map((mg, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              {mg}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {exercise.equipment && (
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span>{exercise.equipment}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
              <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Activity className="h-8 w-8 text-primary" />
                Exercise Library
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse exercises by muscle group with detailed instructions and media
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search exercises, muscle groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>

          {/* Exercises by Muscle Group */}
          <Tabs defaultValue={filteredGroups[0]?.id || "chest"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 mb-6">
              {filteredGroups.map((group) => (
                <TabsTrigger key={group.id} value={group.id} className="text-xs md:text-sm">
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {filteredGroups.map((group) => (
              <TabsContent key={group.id} value={group.id} className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{group.name} Exercises</h2>
                  <p className="text-muted-foreground">
                    {group.exercises.length} exercise{group.exercises.length !== 1 ? 's' : ''} available
                  </p>
            </div>
                
                {group.exercises.length === 0 ? (
            <Card className="p-12 text-center">
              <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
              <p className="text-muted-foreground">
                      Try adjusting your search or filters
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.exercises.map((exercise) => (
                      <ExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Exercise Detail Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedExercise && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedExercise.name}</DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedExercise.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    {/* Media Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedExercise.imageUrl && (
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Image
                          </h3>
                          <img
                            src={selectedExercise.imageUrl}
                            alt={selectedExercise.name}
                            className="w-full h-64 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {selectedExercise.gifUrl && (
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            Animation
                          </h3>
                          <img
                            src={selectedExercise.gifUrl}
                            alt={`${selectedExercise.name} animation`}
                            className="w-full h-64 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Video Section */}
                    {selectedExercise.videoUrl && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Video Demonstration
                        </h3>
                        <video
                          src={selectedExercise.videoUrl}
                          controls
                          className="w-full h-auto rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}

                    {/* Target Muscles */}
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Target Muscle Groups
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.muscleGroups.map((mg, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {mg}
                      </Badge>
                        ))}
                    </div>
                  </div>
                  
                    {/* Sets and Reps */}
                    <div>
                      <h3 className="font-semibold mb-3">Recommended Sets & Reps</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Beginner</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              <strong>Sets:</strong> {selectedExercise.sets.beginner.min}-{selectedExercise.sets.beginner.max}
                            </p>
                            <p className="text-sm">
                              <strong>Reps:</strong> {selectedExercise.reps.beginner.min}-{selectedExercise.reps.beginner.max}
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Intermediate</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              <strong>Sets:</strong> {selectedExercise.sets.intermediate.min}-{selectedExercise.sets.intermediate.max}
                            </p>
                            <p className="text-sm">
                              <strong>Reps:</strong> {selectedExercise.reps.intermediate.min}-{selectedExercise.reps.intermediate.max}
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                  <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Advanced</CardTitle>
                  </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              <strong>Sets:</strong> {selectedExercise.sets.advanced.min}-{selectedExercise.sets.advanced.max}
                            </p>
                            <p className="text-sm">
                              <strong>Reps:</strong> {selectedExercise.reps.advanced.min}-{selectedExercise.reps.advanced.max}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Equipment */}
                    {selectedExercise.equipment && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Dumbbell className="h-4 w-4" />
                          Equipment
                        </h3>
                        <p className="text-muted-foreground">{selectedExercise.equipment}</p>
                      </div>
                    )}

                    {/* Instructions */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Instructions
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {selectedExercise.instructions.map((instruction, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Safety Tips */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        Safety Tips
                      </h3>
                      <ul className="space-y-2">
                        {selectedExercise.safetyTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Action Button */}
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={() => startExercise(selectedExercise)}
                        className="flex-1 bg-primary text-white hover:opacity-90"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Log This Exercise
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </div>
            </div>
                </>
          )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
