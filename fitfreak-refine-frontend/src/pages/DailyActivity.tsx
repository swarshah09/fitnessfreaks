import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, Flame, Info, NotebookPen, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/integrations/api/client";
import { toast } from "@/hooks/use-toast";

type ActivityEntry = {
  _id?: string;
  date: string; // YYYY-MM-DD
  workout: string;
  notes: string;
  checkIn: boolean;
};

export default function DailyActivity() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [workout, setWorkout] = useState("");
  const [notes, setNotes] = useState("");
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => today.toISOString().slice(0, 10), [today]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [historyRes, streakRes] = await Promise.all([
        api.get("/daily-activity"),
        api.get("/daily-activity/streak"),
      ]);

      if (historyRes.data?.ok) {
        setEntries(historyRes.data.data || []);
      }
      if (streakRes.data?.ok) {
        setStreak(streakRes.data.data?.streak || 0);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to fetch activity";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Load today's entry into form when it's available
  useEffect(() => {
    const todayEntry = entries.find((e) => e.date === todayKey);
    if (todayEntry) {
      setWorkout(todayEntry.workout || "");
      setNotes(todayEntry.notes || "");
    }
  }, [entries, todayKey]);

  const todayEntry = entries.find((e) => e.date === todayKey);
  const todayChecked = !!todayEntry?.checkIn;

  const handleSave = async () => {
    if (!workout.trim() && !notes.trim()) return;
    try {
      setIsSaving(true);
      await api.post("/daily-activity/today", {
        workout: workout.trim(),
        notes: notes.trim(),
        checkIn: false,
      });
      setWorkout("");
      setNotes("");
      await fetchData();
      toast({
        title: "Saved",
        description: "Today's activity saved.",
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to save activity";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckIn = async () => {
    if (todayChecked) return;
    try {
      setIsCheckingIn(true);
      await api.post("/daily-activity/today", {
        workout: todayEntry?.workout || "",
        notes: todayEntry?.notes || "",
        checkIn: true,
      });
      await fetchData();
      toast({
        title: "Checked in",
        description: "Attendance marked for today.",
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to check in";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  const sortedEntries = useMemo(
    () =>
      [...entries].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0
      ),
    [entries]
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <NotebookPen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Daily Activity</h1>
          <p className="text-muted-foreground">
            Log today&apos;s workout and notes, and mark your attendance to keep your streak alive.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today&apos;s Activity</CardTitle>
            <CardDescription>Capture what you did today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Workout / Activity</label>
              <Input
                placeholder="e.g., Push day - bench, overhead press, accessories"
                value={workout}
                onChange={(e) => setWorkout(e.target.value)}
                disabled={isSaving || isCheckingIn || isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                placeholder="Energy levels, weights used, mobility, anything notable..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                disabled={isSaving || isCheckingIn || isLoading}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSave}
                disabled={(!workout.trim() && !notes.trim()) || isSaving || isCheckingIn || isLoading}
              >
                {isSaving ? "Saving..." : todayEntry ? "Update today's activity" : "Save today's activity"}
              </Button>
              <Button
                variant={todayChecked ? "secondary" : "outline"}
                onClick={handleCheckIn}
                disabled={todayChecked || isCheckingIn || isSaving || isLoading}
              >
                {todayChecked ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Marked present
                  </>
                ) : isCheckingIn ? (
                  "Marking..."
                ) : (
                  "Mark today present"
                )}
              </Button>
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Info className="h-4 w-4" />
                Attendance can only be marked for today. Past days are locked.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Streak
            </CardTitle>
            <CardDescription>Consecutive days you checked in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold">
              {isLoading ? "—" : `${streak} days`}
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Mark today to keep the streak alive.</p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Today: {format(today, "eeee, MMM d")}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Check in daily; past days can&apos;t be backfilled.</li>
                <li>Jot quick notes to remember what worked.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity & attendance</CardTitle>
          <CardDescription>History is read-only; only today can be updated.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : sortedEntries.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No entries yet. Log today&apos;s activity to start your streak.
            </div>
          ) : (
            <div className="space-y-3">
              {sortedEntries.slice(0, 30).map((entry) => {
                const isToday = entry.date === todayKey;
                return (
                  <div
                    key={entry.date}
                    className="rounded-lg border p-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={entry.checkIn ? "default" : "outline"}>
                          {entry.checkIn ? "Present" : "Not marked"}
                        </Badge>
                        <span className="text-sm font-medium">
                          {format(new Date(entry.date), "eee, MMM d")}
                        </span>
                        {isToday && <Badge variant="secondary">Today</Badge>}
                      </div>
                      {entry.workout && (
                        <p className="text-sm font-medium">{entry.workout}</p>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isToday ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setWorkout(entry.workout || "");
                            setNotes(entry.notes || "");
                            // Scroll to top to show the form
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          Edit
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Flame className="h-4 w-4" />
                          Past days are read-only
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

