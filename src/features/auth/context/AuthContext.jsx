import React, { createContext, useContext, useEffect } from 'react';
import useAppStore from '../../../store';
import { authApi } from '../../../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, role, isAuthenticated, setAuthUser, logout: storeLogout, switchRole: storeSwitchRole } = useAppStore();

  // Citizen Signup handler
  const signup = async (userData) => {
    const res = await authApi.signup(userData);
    if (res.token) {
      localStorage.setItem('geobharat_token', res.token);
    }
    setAuthUser(res.user, res.token);
    return res.user;
  };

  // Login handler
  const login = async (selectedRole = 'citizen', customCredentials = {}) => {
    const res = await authApi.login({ role: selectedRole, ...customCredentials });
    if (res.token) {
      localStorage.setItem('geobharat_token', res.token);
    }
    setAuthUser(res.user, res.token);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('geobharat_token');
    storeLogout();
  };

  const switchRole = (newRole) => {
    storeSwitchRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        signup,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
