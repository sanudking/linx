import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const data = await authAPI.login(credentials);
        set({
          user: data.user,
          token: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
        localStorage.setItem('token', data.accessToken);
        toast.success(`Welcome back, ${data.user.name}!`);
        return data;
      },

      demoLogin: async () => {
        const data = await authAPI.demoLogin();
        set({
          user: data.user,
          token: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
        localStorage.setItem('token', data.accessToken);
        toast.success(`Welcome, ${data.user.name}! (Demo account)`);
        return data;
      },

      register: async (userData) => {
        const data = await authAPI.register(userData);
        set({
          user: data.user,
          token: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
        localStorage.setItem('token', data.accessToken);
        toast.success('Account created! Check your email for verification.');
        return data;
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch {
          // ignore errors on logout
        }
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        localStorage.removeItem('token');
        toast('Signed out successfully', { icon: '👋' });
      },

      // Clears auth state immediately without making any API calls.
      // Used by the auth:logout event handler to avoid re-triggering 401s.
      clearAuth: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        localStorage.removeItem('token');
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : data,
        }));
      },

      initAuth: async () => {
        const token = localStorage.getItem('token') || get().token;
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }
        try {
          const data = await authAPI.me();
          set({ user: data.user, token, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
          localStorage.removeItem('token');
        }
      },
    }),
    {
      name: 'linx-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
