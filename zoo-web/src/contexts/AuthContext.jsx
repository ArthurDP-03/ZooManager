import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuarioNome');
    
    if (storedUser) {
      setUser({ nome: storedUser });
    }
    setLoading(false);
  }, []);

  const login = (userName, userId) => {
    sessionStorage.setItem('usuarioNome', userName);
    sessionStorage.setItem('usuarioId', userId);
    setUser({ nome: userName });
  };

  const logout = async () => {
    try {
      await api.post('/Auth/logout');
    } catch (error) {
      console.error("Erro ao deslogar no servidor", error);
    } finally {
      sessionStorage.clear();
      localStorage.clear();
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);