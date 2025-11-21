import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Animais from './pages/Animais';
import Cuidados from './pages/Cuidados';
import ProtectedRoute from './components/ProtectedRoute'; // <--- Importe o Guarda-Costas

function Layout() {
  const location = useLocation();
  const hideMenu = location.pathname === '/' || location.pathname === '/cadastro';

  return (
    <>
      {!hideMenu && <Navbar />}
      <Routes>
        {/* Rotas Públicas (Qualquer um entra) */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Protegidas (Só com Token) */}
        <Route 
          path="/animais" 
          element={
            <ProtectedRoute>
              <Animais />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cuidados" 
          element={
            <ProtectedRoute>
              <Cuidados />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;