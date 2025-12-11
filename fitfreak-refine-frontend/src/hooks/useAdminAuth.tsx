import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi, adminEndpoints } from '@/integrations/api/adminClient';

interface Admin {
  id: string;
  name: string;
  email: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const storedAdmin = localStorage.getItem('admin');
    const storedToken = localStorage.getItem('adminAuthToken');
    
    if (storedAdmin && storedToken) {
      try {
        const { data } = await adminApi.get(adminEndpoints.checkLogin);
        if (data?.ok) {
          setAdmin(JSON.parse(storedAdmin));
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
      }
    }
    
    // Clear invalid auth
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('admin');
    setAdmin(null);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await adminApi.post(adminEndpoints.login, { email, password });
      if (data?.ok && data?.data?.adminAuthToken) {
        const adminData = data.data.admin;
        localStorage.setItem('adminAuthToken', data.data.adminAuthToken);
        localStorage.setItem('admin', JSON.stringify(adminData));
        setAdmin(adminData);
      } else {
        throw new Error(data?.message || 'Login failed');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('admin');
    setAdmin(null);
    window.location.href = '/admin/login';
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

