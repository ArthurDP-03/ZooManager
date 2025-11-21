import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Cadastro from './pages/Register'; // Mudei o nome do arquivo para Register.jsx para seguir o padrão
import Animais from './pages/Animais';
import AnimalDetalhes from './pages/AnimalDetalhes';
import ProtectedRoute from './components/ProtectedRoute';

function Layout() {
  const location = useLocation();
  const hideMenu = location.pathname === '/' || location.pathname === '/register';

  return (
    <>
      {!hideMenu && <Navbar />}
      <div style={{ paddingBottom: '50px' }}> {/* Espaço rodapé */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Cadastro />} />

          <Route path="/animais" element={
            <ProtectedRoute><Animais /></ProtectedRoute>
          } />
          
          {/* NOVA ROTA DE DETALHES */}
          <Route path="/animais/:id" element={
            <ProtectedRoute><AnimalDetalhes /></ProtectedRoute>
          } />
        </Routes>
      </div>
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