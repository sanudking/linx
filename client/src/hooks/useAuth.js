import useAuthStore from '../store/authStore';

const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const initAuth = useAuthStore((s) => s.initAuth);

  return { user, token, isAuthenticated, login, register, logout, updateProfile, initAuth };
};

export default useAuth;
