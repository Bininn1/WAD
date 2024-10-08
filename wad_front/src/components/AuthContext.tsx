// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (token: string) => void; // 토큰을 인수로 받을 수 있도록 수정
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰을 읽어옴
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // 토큰이 있으면 true로 설정

  const login = (token: string) => { // 로그인 성공 후 서버에서 받은 토큰을 인수로 받음
    localStorage.setItem('token', token); // 토큰을 로컬 스토리지에 저장
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token'); // 로컬 스토리지에서 토큰을 제거
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
