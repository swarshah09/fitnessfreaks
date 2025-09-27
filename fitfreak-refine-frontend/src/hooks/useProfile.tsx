import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api, endpoints } from '@/integrations/api/client';

interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  weight: number | null;
  height: number | null;
  gender: string | null;
  date_of_birth: string | null;
  goal: string | null;
  activity_level: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    } else {
      setIsLoading(false);
      setProfile(null);
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await api.get(endpoints.me);
      if (!data) {
        setProfile(null);
        return;
      }

      const lastWeight = Array.isArray(data.weight) && data.weight.length > 0
        ? data.weight[data.weight.length - 1].weight
        : null;
      const lastHeight = Array.isArray(data.height) && data.height.length > 0
        ? data.height[data.height.length - 1].height
        : null;

      const mapped: UserProfile = {
        id: data._id,
        user_id: data._id,
        name: data.name ?? null,
        email: data.email ?? null,
        weight: lastWeight,
        height: lastHeight,
        gender: data.gender ?? null,
        date_of_birth: data.dob ?? null,
        goal: data.goal ?? null,
        activity_level: data.activityLevel ?? null,
        created_at: data.createdAt ?? new Date().toISOString(),
        updated_at: data.updatedAt ?? new Date().toISOString(),
      };

      setProfile(mapped);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err?.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };
    // Not implemented; backend update endpoint is not present
    return { error: 'Not implemented' };
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
}