import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load all pages for code splitting and faster initial load
const Landing = lazy(() => import("./pages/Landing"));
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Workouts = lazy(() => import("./pages/Workouts"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const BMICalculator = lazy(() => import("./pages/BMICalculator"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Water = lazy(() => import("./pages/Water"));
const Sleep = lazy(() => import("./pages/Sleep"));
const Steps = lazy(() => import("./pages/Steps"));
const Weight = lazy(() => import("./pages/Weight"));
const Goals = lazy(() => import("./pages/Goals"));
const Progress = lazy(() => import("./pages/Progress"));
const DailyActivity = lazy(() => import("./pages/DailyActivity"));
const Recipes = lazy(() => import("./pages/Recipes"));
const StartWorkout = lazy(() => import("./pages/StartWorkout"));
const Profile = lazy(() => import("./pages/Profile"));
const FitGram = lazy(() => import("./pages/FitGram"));
const FitGramProfile = lazy(() => import("./pages/FitGramProfile"));
const FitGramMyProfile = lazy(() => import("./pages/FitGramMyProfile"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminWorkouts = lazy(() => import("./pages/admin/AdminWorkouts"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh for 5 min
      cacheTime: 1000 * 60 * 10, // 10 minutes - cache persists for 10 min
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Use cached data if available
      retry: 1, // Only retry once on failure
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/workouts" element={
                  <AdminProtectedRoute>
                    <AdminWorkouts />
                  </AdminProtectedRoute>
                } />
                
                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/workouts" element={
                  <ProtectedRoute>
                    <Workouts />
                  </ProtectedRoute>
                } />
                <Route path="/nutrition" element={
                  <ProtectedRoute>
                    <Nutrition />
                  </ProtectedRoute>
                } />
                <Route path="/bmi" element={
                  <ProtectedRoute>
                    <BMICalculator />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/water" element={
                  <ProtectedRoute>
                    <Water />
                  </ProtectedRoute>
                } />
                <Route path="/sleep" element={
                  <ProtectedRoute>
                    <Sleep />
                  </ProtectedRoute>
                } />
                <Route path="/steps" element={
                  <ProtectedRoute>
                    <Steps />
                  </ProtectedRoute>
                } />
                <Route path="/weight" element={
                  <ProtectedRoute>
                    <Weight />
                  </ProtectedRoute>
                } />
                <Route path="/activity" element={
                  <ProtectedRoute>
                    <DailyActivity />
                  </ProtectedRoute>
                } />
                <Route path="/start-workout" element={
                  <ProtectedRoute>
                    <StartWorkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/goals" element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                } />
                <Route path="/recipes" element={
                  <ProtectedRoute>
                    <Recipes />
                  </ProtectedRoute>
                } />
                <Route path="/fitgram" element={
                  <ProtectedRoute>
                    <FitGram />
                  </ProtectedRoute>
                } />
                <Route path="/fitgram/profile/:id" element={
                  <ProtectedRoute>
                    <FitGramProfile />
                  </ProtectedRoute>
                } />
                <Route path="/fitgram/me" element={
                  <ProtectedRoute>
                    <FitGramMyProfile />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
