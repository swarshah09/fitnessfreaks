import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import BMICalculator from "./pages/BMICalculator";
import Analytics from "./pages/Analytics";
import Water from "./pages/Water";
import Sleep from "./pages/Sleep";
import Steps from "./pages/Steps";
import Weight from "./pages/Weight";
import Goals from "./pages/Goals";
import Progress from "./pages/Progress";
import DailyActivity from "./pages/DailyActivity";
import Recipes from "./pages/Recipes";
import StartWorkout from "./pages/StartWorkout";
import Profile from "./pages/Profile";
import FitGram from "./pages/FitGram";
import FitGramProfile from "./pages/FitGramProfile";
import FitGramMyProfile from "./pages/FitGramMyProfile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWorkouts from "./pages/admin/AdminWorkouts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
