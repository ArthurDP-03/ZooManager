import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuarioNome');
    const storedToken = sessionStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser({ nome: storedUser });
    }
    setLoading(false);
  }, []);

  const login = (userName, userToken, userId) => {
    sessionStorage.setItem('usuarioNome', userName);
    sessionStorage.setItem('usuarioId', userId);
    sessionStorage.setItem('token', userToken); 
    
    setUser({ nome: userName });
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);