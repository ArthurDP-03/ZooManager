import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // <--- Importe
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Animais from './pages/Animais';
import AnimalDetalhes from './pages/AnimalDetalhes';
import Cuidados from './pages/Cuidados';

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

function App() {
  return (
    // <--- Envolve tudo com o Provider
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

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