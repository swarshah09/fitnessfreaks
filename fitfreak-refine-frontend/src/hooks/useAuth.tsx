import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, endpoints } from '@/integrations/api/client';

interface AuthUser {
  _id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(endpoints.me);
        if (data && data._id && data.email) {
          setUser({ _id: data._id, email: data.email, name: data.name });
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      const payload = {
        name: metadata.name,
        email,
        password,
        weightInKg: metadata.weight,
        heightInCm: metadata.height,
        gender: metadata.gender,
        dob: metadata.date_of_birth,
        goal: metadata.goal,
        activityLevel: metadata.activity_level,
      };
      await api.post(endpoints.register, payload);
      return { error: null };
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Registration failed';
      return { error: { message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await api.post(endpoints.login, { email, password });
      const { data } = await api.get(endpoints.me);
      if (data && data._id && data.email) {
        setUser({ _id: data._id, email: data.email, name: data.name });
      }
      return { error: null };
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.message || 'Login failed';
      return { error: { message } };
    }
  };

  const signOut = async () => {
    try {
      await api.post(endpoints.logout);
    } catch {}
    setUser(null);
  };

  const updateProfile = async (updates: any) => {
    // Not implemented on backend yet
    if (!user) return { error: 'No user logged in' };
    return { error: 'Not implemented' };
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}