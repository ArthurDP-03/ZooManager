import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao iniciar, verifica se já tem dados no sessionStorage
    const storedUser = sessionStorage.getItem('usuarioNome');
    const token = sessionStorage.getItem('token');

    if (storedUser && token) {
      setUser({ nome: storedUser, token });
    }
    setLoading(false);
  }, []);

  const login = (userData, token, id) => {
    // Salva no sessionStorage
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuarioNome', userData);
    sessionStorage.setItem('usuarioId', id);
    
    // Atualiza o estado (Isso faz a Navbar atualizar na hora!)
    setUser({ nome: userData, token });
  };

  const logout = () => {
    localStorage.clear();
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