import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Animais from './pages/Animais';
import Cuidados from './pages/Cuidados';

// Componente para controlar onde o Menu aparece
function Layout() {
  const location = useLocation();
  // Esconde o menu se for login ou cadastro
  const hideMenu = location.pathname === '/' || location.pathname === '/cadastro';

  return (
    <>
      {!hideMenu && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/animais" element={<Animais />} />
        <Route path="/cuidados" element={<Cuidados />} />
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