import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { adminApi, adminEndpoints } from "@/integrations/api/adminClient";
import { toast } from "@/hooks/use-toast";
import { 
  Dumbbell, 
  Search, 
  Edit, 
  Trash2, 
  Plus,
  Loader2,
  Clock,
  Image as ImageIcon
} from "lucide-react";
import { Label } from "@/components/ui/label";

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
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [workoutForm, setWorkoutForm] = useState({
    name: "",
    description: "",
    durationInMinutes: "",
    imageURL: "",
    exercises: [] as Exercise[],
  });

  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    description: "",
    sets: "",
    reps: "",
    imageURL: "",
  });

  const [showExerciseForm, setShowExerciseForm] = useState(false);

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await adminApi.get(adminEndpoints.workouts);
      if (data?.ok) {
        setWorkouts(data.data);
        setFilteredWorkouts(data.data);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch workouts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = workouts.filter(
        (workout) =>
          workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workout.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWorkouts(filtered);
    } else {
      setFilteredWorkouts(workouts);
    }
  }, [searchQuery, workouts]);

  const resetForm = () => {
    setWorkoutForm({
      name: "",
      description: "",
      durationInMinutes: "",
      imageURL: "",
      exercises: [],
    });
    setExerciseForm({
      name: "",
      description: "",
      sets: "",
      reps: "",
      imageURL: "",
    });
    setShowExerciseForm(false);
    setSelectedWorkout(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (workout: Workout) => {
    setSelectedWorkout(workout);
    setWorkoutForm({
      name: workout.name,
      description: workout.description,
      durationInMinutes: workout.durationInMinutes.toString(),
      imageURL: workout.imageURL,
      exercises: workout.exercises || [],
    });
    setIsDialogOpen(true);
  };

  const addExercise = () => {
    if (!exerciseForm.name || !exerciseForm.description || !exerciseForm.sets || !exerciseForm.reps) {
      toast({
        title: "Error",
        description: "Please fill all exercise fields",
        variant: "destructive",
      });
      return;
    }

    setWorkoutForm({
      ...workoutForm,
      exercises: [
        ...workoutForm.exercises,
        {
          name: exerciseForm.name,
          description: exerciseForm.description,
          sets: parseInt(exerciseForm.sets),
          reps: parseInt(exerciseForm.reps),
          imageURL: exerciseForm.imageURL,
        },
      ],
    });

    setExerciseForm({
      name: "",
      description: "",
      sets: "",
      reps: "",
      imageURL: "",
    });
    setShowExerciseForm(false);
  };

  const removeExercise = (index: number) => {
    setWorkoutForm({
      ...workoutForm,
      exercises: workoutForm.exercises.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!workoutForm.name || !workoutForm.description || !workoutForm.durationInMinutes) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedWorkout) {
        setIsSaving(true);
        const { data } = await adminApi.put(
          `${adminEndpoints.workouts}/${selectedWorkout._id}`,
          {
            ...workoutForm,
            durationInMinutes: parseInt(workoutForm.durationInMinutes),
          }
        );
        if (data?.ok) {
          toast({
            title: "Success",
            description: "Workout updated successfully",
          });
          setIsDialogOpen(false);
          resetForm();
          fetchWorkouts();
        }
      } else {
        setIsCreating(true);
        const { data } = await adminApi.post(adminEndpoints.workouts, {
          ...workoutForm,
          durationInMinutes: parseInt(workoutForm.durationInMinutes),
        });
        if (data?.ok) {
          toast({
            title: "Success",
            description: "Workout created successfully",
          });
          setIsDialogOpen(false);
          resetForm();
          fetchWorkouts();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save workout",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWorkout) return;

    try {
      setIsDeleting(true);
      const { data } = await adminApi.delete(`${adminEndpoints.workouts}/${selectedWorkout._id}`);
      if (data?.ok) {
        toast({
          title: "Success",
          description: "Workout deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        setSelectedWorkout(null);
        fetchWorkouts();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete workout",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              Workout Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage workout plans
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workout
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Workouts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <Card className="p-12 text-center">
            <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No workouts found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "Create your first workout plan"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkouts.map((workout) => (
              <Card key={workout._id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {workout.imageURL && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={workout.imageURL}
                      alt={workout.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{workout.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {workout.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(workout)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedWorkout(workout);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {workout.durationInMinutes} min
                    </div>
                    <Badge variant="outline">
                      {workout.exercises?.length || 0} exercises
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedWorkout ? "Edit Workout" : "Create Workout"}
              </DialogTitle>
              <DialogDescription>
                {selectedWorkout ? "Update workout information" : "Create a new workout plan"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workout-name">Workout Name *</Label>
                <Input
                  id="workout-name"
                  value={workoutForm.name}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                  placeholder="e.g., Full Body Strength"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workout-description">Description *</Label>
                <Textarea
                  id="workout-description"
                  value={workoutForm.description}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, description: e.target.value })}
                  placeholder="Describe the workout..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workout-duration">Duration (minutes) *</Label>
                  <Input
                    id="workout-duration"
                    type="number"
                    value={workoutForm.durationInMinutes}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, durationInMinutes: e.target.value })}
                    placeholder="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workout-image">Image URL</Label>
                  <Input
                    id="workout-image"
                    value={workoutForm.imageURL}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, imageURL: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Exercises Section */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Exercises ({workoutForm.exercises.length})</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExerciseForm(!showExerciseForm)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exercise
                  </Button>
                </div>

                {showExerciseForm && (
                  <Card className="p-4 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="exercise-name">Exercise Name *</Label>
                      <Input
                        id="exercise-name"
                        value={exerciseForm.name}
                        onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                        placeholder="e.g., Bench Press"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exercise-description">Description *</Label>
                      <Textarea
                        id="exercise-description"
                        value={exerciseForm.description}
                        onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
                        placeholder="Exercise description..."
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="exercise-sets">Sets *</Label>
                        <Input
                          id="exercise-sets"
                          type="number"
                          value={exerciseForm.sets}
                          onChange={(e) => setExerciseForm({ ...exerciseForm, sets: e.target.value })}
                          placeholder="3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exercise-reps">Reps *</Label>
                        <Input
                          id="exercise-reps"
                          type="number"
                          value={exerciseForm.reps}
                          onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                          placeholder="10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exercise-image">Image URL</Label>
                      <Input
                        id="exercise-image"
                        value={exerciseForm.imageURL}
                        onChange={(e) => setExerciseForm({ ...exerciseForm, imageURL: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" onClick={addExercise} className="flex-1">
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowExerciseForm(false);
                          setExerciseForm({
                            name: "",
                            description: "",
                            sets: "",
                            reps: "",
                            imageURL: "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                )}

                {workoutForm.exercises.length > 0 && (
                  <div className="space-y-2">
                    {workoutForm.exercises.map((exercise, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold">{exercise.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {exercise.description}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {exercise.sets} sets × {exercise.reps} reps
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExercise(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving || isCreating}>
                {isSaving || isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedWorkout ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  selectedWorkout ? "Save Changes" : "Create Workout"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the workout
                {selectedWorkout && ` "${selectedWorkout.name}"`}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

