import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register'; // Mudei para Register.jsx
import Animais from './pages/Animais';
import AnimalDetalhes from './pages/AnimalDetalhes';
import Cuidados from './pages/Cuidados';

// 🔐 Layout Protegido: Só entra quem TEM usuário
const ProtectedLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingBottom: '50px' }}>
        <Outlet />
      </div>
    </>
  );
};
const PublicLayout = () => {
  const { user } = useAuth();

  if (user) {
    // Se já está logado, joga direto para a área principal
    return <Navigate to="/animais" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Grupo de Rotas para quem NÃO está logado */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Grupo de Rotas para quem ESTÁ logado */}
          <Route element={<ProtectedLayout />}>
            <Route path="/animais" element={<Animais />} />
            <Route path="/animais/:id" element={<AnimalDetalhes />} />
            <Route path="/cuidados" element={<Cuidados />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;