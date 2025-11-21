import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const usuario = localStorage.getItem('usuarioNome');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav style={{ backgroundColor: 'var(--jungle-dark)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
      <Link to="/animais" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
        🌿 ZooManager
      </Link>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Olá, {usuario}</span>
        <Link to="/animais" style={{ color: 'white', textDecoration: 'none' }}>Animais</Link>
        <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;