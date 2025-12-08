import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { api, endpoints } from '@/integrations/api/client';

interface AuthUser {
  _id: string;
  email: string;
  name?: string;
}

interface SignUpMetadata {
  name?: string;
  weight?: number;
  weightInKg?: number;
  height?: number;
  heightInCm?: number;
  gender?: string;
  date_of_birth?: string;
  dob?: string;
  goal?: string;
  activity_level?: string;
  activityLevel?: string;
}

interface AuthActionError {
  message: string;
}

type AuthActionResult = { error: AuthActionError | null };

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, metadata?: SignUpMetadata) => Promise<AuthActionResult>;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Record<string, unknown>) => Promise<AuthActionResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type ApiUserPayload = Partial<AuthUser> & { _id?: string; email?: string };

type ApiResponse<T> = {
  ok: boolean;
  message: string;
  data?: T;
};

interface LoginSuccessData {
  authToken: string;
  refreshToken: string;
  user?: ApiUserPayload;
}

const mapAuthUser = (data: unknown): AuthUser | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }
  const maybeUser = data as ApiUserPayload;
  if (!maybeUser._id || !maybeUser.email) {
    return null;
  }
  return {
    _id: maybeUser._id,
    email: maybeUser.email,
    name: maybeUser.name,
  };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (error && typeof error === 'object') {
    const maybeResponse = error as { response?: { data?: { message?: string } } };
    if (typeof maybeResponse.response?.data?.message === 'string') {
      return maybeResponse.response.data.message;
    }
  }
  return fallback;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<unknown>(endpoints.me);
      const mappedUser = mapAuthUser(data);
      setUser(mappedUser);
      return mappedUser;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signUp = async (email: string, password: string, metadata: SignUpMetadata = {}) => {
    try {
      const payload = {
        name: metadata.name,
        email,
        password,
        weightInKg: metadata.weight ?? metadata.weightInKg,
        heightInCm: metadata.height ?? metadata.heightInCm,
        gender: metadata.gender,
        dob: metadata.date_of_birth ?? metadata.dob,
        goal: metadata.goal,
        activityLevel: metadata.activity_level ?? metadata.activityLevel,
      };

      const normalizedPayload = {
        ...payload,
        weightInKg: payload.weightInKg !== undefined ? Number(payload.weightInKg) : undefined,
        heightInCm: payload.heightInCm !== undefined ? Number(payload.heightInCm) : undefined,
      };

      if (
        !normalizedPayload.name ||
        !normalizedPayload.gender ||
        !normalizedPayload.dob ||
        !normalizedPayload.goal ||
        !normalizedPayload.activityLevel ||
        !normalizedPayload.weightInKg ||
        !normalizedPayload.heightInCm
      ) {
        return { error: { message: 'Please complete all required fields' } };
      }

      await api.post(endpoints.register, normalizedPayload);
      return { error: null };
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Registration failed');
      return { error: { message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post<ApiResponse<LoginSuccessData>>(endpoints.login, { email, password });
      if (data?.data?.user) {
        const mapped = mapAuthUser(data.data.user);
        setUser(mapped);
      } else {
        await fetchUser();
      }
      return { error: null };
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Login failed');
      return { error: { message } };
    }
  };

  const signOut = async () => {
    try {
      await api.post(endpoints.logout);
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
  };

  const updateProfile = async (_updates: Record<string, unknown>) => {
    if (!user) return { error: { message: 'No user logged in' } };
    return { error: { message: 'Not implemented' } };
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