import { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Clock, Volume2, VolumeX } from "lucide-react";

type Step = {
  title: string;
  description: string;
  duration: number; // seconds
  type: "warmup" | "chest" | "back" | "arms" | "abs" | "legs" | "cooldown" | "rest" | "circuit";
};

type Plan = {
  id: string;
  name: string;
  goal: string;
  totalMinutes: number;
  steps: Step[];
  summary: string;
};

// Very short embedded sounds (wav data URIs)
const sounds = {
  start: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YYgAAAAA", // short blip
  tick: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YWQAAAAA", // tiny tick
  change: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YaQAAAAA", // short beep
  done: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YbQAAAAA", // slightly longer beep
};

const plans: Plan[] = [
  {
    id: "instant",
    name: "20-Minute Full Body (Instant)",
    goal: "Quick full-body with warm-up and cool-down",
    totalMinutes: 20,
    summary: "Warm-up, chest, back, arms, abs, legs, cool-down in 20 minutes.",
    steps: [
      // Warm-up 3 min (6 x 30s)
      { title: "Warm-Up: Arm Circles", description: "15s forward + 15s backward", duration: 30, type: "warmup" },
      { title: "Warm-Up: Neck Rotations", description: "Gentle circles", duration: 30, type: "warmup" },
      { title: "Warm-Up: Torso Twists", description: "Controlled rotations", duration: 30, type: "warmup" },
      { title: "Warm-Up: Hip Circles", description: "Loosen hips", duration: 30, type: "warmup" },
      { title: "Warm-Up: Jog in Place", description: "Light pace", duration: 30, type: "warmup" },
      { title: "Warm-Up: Leg Swings", description: "Dynamic leg swings each leg", duration: 30, type: "warmup" },
      // Chest 3 min
      { title: "Chest: Push-Ups", description: "3 sets × 10–12 reps", duration: 60, type: "chest" },
      { title: "Rest", description: "Catch breath", duration: 20, type: "rest" },
      { title: "Chest: Incline Push-Ups", description: "2 sets × 12 reps", duration: 60, type: "chest" },
      { title: "Rest", description: "Short rest", duration: 20, type: "rest" },
      // Back 3 min
      { title: "Back: Supermans", description: "3 sets × 12 reps", duration: 60, type: "back" },
      { title: "Rest", description: "Short rest", duration: 20, type: "rest" },
      { title: "Back: Reverse Snow Angels", description: "2 sets × 10 reps", duration: 60, type: "back" },
      { title: "Rest", description: "Short rest", duration: 20, type: "rest" },
      // Arms 3 min
      { title: "Arms: Tricep Dips", description: "3 sets × 10–12 (chair)", duration: 60, type: "arms" },
      { title: "Rest", description: "Short rest", duration: 20, type: "rest" },
      { title: "Arms: Bicep Curls", description: "3 sets × 12 (backpack/bottles)", duration: 60, type: "arms" },
      { title: "Rest", description: "Short rest", duration: 20, type: "rest" },
      // Abs 2.5 min (5 x 30s)
      { title: "Abs: Crunches", description: "30 sec", duration: 30, type: "abs" },
      { title: "Abs: Plank", description: "30 sec", duration: 30, type: "abs" },
      { title: "Abs: Leg Raises", description: "30 sec", duration: 30, type: "abs" },
      { title: "Abs: Russian Twists", description: "30 sec", duration: 30, type: "abs" },
      { title: "Abs: Mountain Climbers", description: "30 sec", duration: 30, type: "abs" },
      // Legs 3 min
      { title: "Legs: Squats", description: "3 sets × 15 reps", duration: 60, type: "legs" },
      { title: "Rest", description: "Short rest", duration: 20, type: "rest" },
      { title: "Legs: Lunges", description: "2 sets × 10 each leg", duration: 60, type: "legs" },
      { title: "Rest", description: "Short rest", duration: 20, type: "rest" },
      // Cool-down 2 min (5 x 20s)
      { title: "Cool-Down: Hamstring Stretch", description: "~20 sec", duration: 20, type: "cooldown" },
      { title: "Cool-Down: Chest Stretch", description: "Doorway stretch ~20 sec", duration: 20, type: "cooldown" },
      { title: "Cool-Down: Quad Stretch", description: "~20 sec each leg", duration: 20, type: "cooldown" },
      { title: "Cool-Down: Upper Back Stretch", description: "Hug yourself", duration: 20, type: "cooldown" },
      { title: "Cool-Down: Deep Breathing", description: "~20 sec", duration: 20, type: "cooldown" },
    ],
  },
  {
    id: "muscle-home",
    name: "Muscle Gain (Home)",
    goal: "Minimal equipment strength focus",
    totalMinutes: 22,
    summary: "Decline push-ups, backpack rows, dips, curls, core, legs, cool-down.",
    steps: [
      { title: "Warm-Up", description: "Arm circles, jog, chest openers, hips, leg swings", duration: 180, type: "warmup" },
      { title: "Chest: Decline Push-Ups", description: "4×10–12, tempo 3s down on next block", duration: 120, type: "chest" },
      { title: "Chest: Tempo Push-Ups", description: "3×8–10 @3s eccentric", duration: 120, type: "chest" },
      { title: "Back: Backpack Rows", description: "4×12", duration: 120, type: "back" },
      { title: "Back: Reverse Snow Angels", description: "3×12", duration: 90, type: "back" },
      { title: "Arms: Backpack Curls", description: "3×12–15", duration: 90, type: "arms" },
      { title: "Arms: Tricep Dips", description: "3×12", duration: 90, type: "arms" },
      { title: "Abs", description: "Leg raises 3×12, Plank 1 min", duration: 150, type: "abs" },
      { title: "Legs: Slow Squats", description: "4×15 @3s down", duration: 120, type: "legs" },
      { title: "Legs: Lunges", description: "3×12 each", duration: 120, type: "legs" },
      { title: "Cool-Down", description: "Chest stretch, hamstring stretch", duration: 120, type: "cooldown" },
    ],
  },
  {
    id: "loss-home",
    name: "Weight Loss (Home HIIT)",
    goal: "High intensity calorie burn",
    totalMinutes: 20,
    summary: "HIIT circuits for chest/back, arms, abs, legs with short rests.",
    steps: [
      { title: "Warm-Up HIIT", description: "High knees, arm swings, hip mobility, jumping jacks", duration: 120, type: "warmup" },
      { title: "Circuit Chest+Back", description: "Push-ups 12, Supermans 15, Incline push-ups 12, Backpack rows 15", duration: 240, type: "circuit" },
      { title: "Rest", description: "45s rest", duration: 45, type: "rest" },
      { title: "Arms Fast", description: "Dips 2×15, Curls 2×20", duration: 120, type: "arms" },
      { title: "Abs HIIT", description: "MC 30s, Crunch 20 reps, Russian 30s, Plank 30s", duration: 150, type: "abs" },
      { title: "Legs Burn", description: "Squat jumps 3×15, Reverse lunges 2×12/leg", duration: 180, type: "legs" },
      { title: "Cool-Down", description: "2 min easy stretch", duration: 120, type: "cooldown" },
    ],
  },
  {
    id: "muscle-gym",
    name: "Muscle Gain (Gym)",
    goal: "Hypertrophy focus with machines",
    totalMinutes: 25,
    summary: "Bench, fly, pulldown, row, curls, pushdowns, core, legs, cool-down.",
    steps: [
      { title: "Warm-Up", description: "Treadmill walk + mobility", duration: 180, type: "warmup" },
      { title: "Chest: Bench Press", description: "4×8–10", duration: 150, type: "chest" },
      { title: "Chest: Cable Fly / Pec Deck", description: "3×12–15", duration: 120, type: "chest" },
      { title: "Back: Lat Pulldown", description: "4×10", duration: 150, type: "back" },
      { title: "Back: Seated Row", description: "3×12", duration: 120, type: "back" },
      { title: "Arms: DB Curl", description: "3×12", duration: 120, type: "arms" },
      { title: "Arms: Rope Pushdown", description: "3×12–15", duration: 120, type: "arms" },
      { title: "Abs", description: "Cable crunch 3×15, Hanging knee raises 2×10", duration: 180, type: "abs" },
      { title: "Legs: Leg Press", description: "4×12", duration: 150, type: "legs" },
      { title: "Legs: Leg Extensions", description: "3×15", duration: 120, type: "legs" },
      { title: "Cool-Down", description: "Light stretch", duration: 120, type: "cooldown" },
    ],
  },
  {
    id: "loss-gym",
    name: "Weight Loss (Gym)",
    goal: "High calorie burn with machines",
    totalMinutes: 23,
    summary: "Incline walk, chest/back supersets, arms, abs, legs, cool-down.",
    steps: [
      { title: "Warm-Up", description: "Row 1 min, arm circles, incline walk", duration: 180, type: "warmup" },
      { title: "Chest+Back Superset", description: "Push-ups 12, Lat pulldown 12, Chest press 12, Cable row 12", duration: 240, type: "circuit" },
      { title: "Rest", description: "45s rest", duration: 45, type: "rest" },
      { title: "Arms", description: "Rope hammer curls 2×15, Bench dips 2×15", duration: 120, type: "arms" },
      { title: "Abs", description: "Plank 45s, Bicycle 30 reps", duration: 120, type: "abs" },
      { title: "Legs Fat Burn", description: "Goblet squats 3×15, Walking lunges 2×20 steps", duration: 180, type: "legs" },
      { title: "Cool-Down", description: "2 min stretch", duration: 120, type: "cooldown" },
    ],
  },
];

const typeColors: Record<Step["type"], string> = {
  warmup: "bg-amber-100 text-amber-800",
  chest: "bg-red-100 text-red-800",
  back: "bg-blue-100 text-blue-800",
  arms: "bg-purple-100 text-purple-800",
  abs: "bg-teal-100 text-teal-800",
  legs: "bg-green-100 text-green-800",
  cooldown: "bg-slate-100 text-slate-800",
  rest: "bg-gray-100 text-gray-700",
  circuit: "bg-orange-100 text-orange-800",
};

export default function StartWorkout() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("instant");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [mute, setMute] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const plan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId) || plans[0],
    [selectedPlanId]
  );

  useEffect(() => {
    // preload sounds
    const map: Record<string, HTMLAudioElement> = {};
    Object.entries(sounds).forEach(([key, src]) => {
      const a = new Audio(src);
      a.preload = "auto";
      map[key] = a;
    });
    audioRefs.current = map;
  }, []);

  useEffect(() => {
    if (!plan) return;
    // reset when plan changes
    setCurrentStepIndex(0);
    setTimeLeft(plan.steps[0]?.duration || 0);
    setIsRunning(false);
  }, [plan]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (!plan) return;
    if (timeLeft <= 0 && isRunning) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < plan.steps.length) {
        setCurrentStepIndex(nextIndex);
        setTimeLeft(plan.steps[nextIndex].duration);
        playSound("change");
      } else {
        // finished
        setIsRunning(false);
        setTimeLeft(0);
        playSound("done");
      }
    }
  }, [timeLeft, isRunning, currentStepIndex, plan]);

  const playSound = (key: "start" | "tick" | "change" | "done") => {
    if (mute) return;
    const audio = audioRefs.current[key];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const handleStart = () => {
    if (!plan) return;
    if (timeLeft <= 0) {
      setCurrentStepIndex(0);
      setTimeLeft(plan.steps[0]?.duration || 0);
    }
    playSound("start");
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    if (!plan) return;
    setIsRunning(false);
    setCurrentStepIndex(0);
    setTimeLeft(plan.steps[0]?.duration || 0);
  };

  const currentStep = plan?.steps[currentStepIndex];
  const totalSeconds = plan?.steps.reduce((s, step) => s + step.duration, 0) || 1;
  const elapsedSeconds =
    plan?.steps
      .slice(0, currentStepIndex)
      .reduce((s, step) => s + step.duration, 0) || 0;
  const overallProgress = Math.min(
    100,
    ((elapsedSeconds + Math.max(timeLeft, 0)) / totalSeconds) * 100
  );

  // tick sound each second while running
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      playSound("tick");
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mute]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <Play className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Start Workout</h1>
          <p className="text-muted-foreground">
            Pick a plan, hit start, follow the timer. Beeps play at transitions (toggle sound if needed).
          </p>
        </div>
      </div>

      <Tabs value={selectedPlanId} onValueChange={setSelectedPlanId}>
        <TabsList className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto w-full px-1">
          {plans.map((p) => (
            <TabsTrigger key={p.id} value={p.id} className="capitalize">
              {p.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {plans.map((p) => (
          <TabsContent key={p.id} value={p.id} className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <CardTitle className="text-xl">{p.name}</CardTitle>
                  <CardDescription>{p.summary}</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {p.totalMinutes} min • {p.goal}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {p.steps.map((step, idx) => (
                    <div
                      key={`${step.title}-${idx}`}
                      className="border rounded-lg p-3 flex items-start gap-3 bg-card/50"
                    >
                      <Badge className={typeColors[step.type]}>
                        {step.type}
                      </Badge>
                      <div className="space-y-1">
                        <div className="font-semibold">{step.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {step.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(step.duration / 60)} min {step.duration % 60 !== 0 ? `${step.duration % 60}s` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {plan && (
        <Card className="border-primary/30 shadow-sm sticky bottom-4 md:static z-10">
          <CardHeader>
            <CardTitle>Live Timer</CardTitle>
            <CardDescription>
              Current step, remaining time, and overall progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={typeColors[currentStep?.type || "rest"]}>
                {currentStep?.type || "ready"}
              </Badge>
              <span className="text-lg font-semibold">{currentStep?.title || "Ready"}</span>
            </div>
            <div className="text-muted-foreground">{currentStep?.description}</div>

            <div className="text-3xl font-bold">
              {Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")}
              :
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            <Progress value={(timeLeft / (currentStep?.duration || 1)) * 100} />

            <div className="text-sm text-muted-foreground">
              Overall: {Math.round(((elapsedSeconds + Math.max(timeLeft, 0)) / totalSeconds) * 100)}% • Step {currentStepIndex + 1} of {plan.steps.length}
            </div>

            <div className="flex flex-wrap gap-2">
              {!isRunning ? (
                <Button onClick={handleStart} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start
                </Button>
              ) : (
                <Button onClick={handlePause} variant="secondary" className="flex items-center gap-2">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => setMute((m) => !m)}
              >
                {mute ? (
                  <>
                    <VolumeX className="h-4 w-4" /> Sound Off
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" /> Sound On
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

