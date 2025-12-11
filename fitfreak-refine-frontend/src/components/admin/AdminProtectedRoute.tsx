import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2 } from "lucide-react";

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('adminAuthToken');
    
    // If no token and not loading, redirect to login
    if (!isLoading && !storedToken) {
      navigate("/admin/login");
      return;
    }

    // If loading is done and still not authenticated, redirect
    if (!isLoading && !isAuthenticated && storedToken) {
      // Token might be invalid, clear it and redirect
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('admin');
      navigate("/admin/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If authenticated, show children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, show nothing (will redirect)
  return null;
}

