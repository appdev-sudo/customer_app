import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {UserProfile} from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  returnRoute: string | null;
  login: (token: string, user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserProfile) => void;
  setReturnRoute: (route: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@vytalyou_token';
const USER_KEY = '@vytalyou_user';
const RETURN_ROUTE_KEY = '@vytalyou_return_route';

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [returnRoute, setReturnRouteState] = useState<string | null>(null);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const [storedToken, storedUser, storedRoute] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
        AsyncStorage.getItem(RETURN_ROUTE_KEY),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }

      if (storedRoute) {
        setReturnRouteState(storedRoute);
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (newToken: string, newUser: UserProfile) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to save auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, RETURN_ROUTE_KEY]);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setReturnRouteState(null);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  };

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const setReturnRoute = async (route: string | null) => {
    setReturnRouteState(route);
    if (route) {
      await AsyncStorage.setItem(RETURN_ROUTE_KEY, route);
    } else {
      await AsyncStorage.removeItem(RETURN_ROUTE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        loading,
        returnRoute,
        login,
        logout,
        updateUser,
        setReturnRoute,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
