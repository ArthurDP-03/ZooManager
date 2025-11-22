import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';

function Navbar() {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav style={{ backgroundColor: 'var(--jungle-dark)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        <Link to="/animais" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
          🌿 ZooManager
        </Link>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Olá, {user ? user.nome : 'Visitante'}
          </span>
          
          <Link to="/animais" style={{ color: 'white', textDecoration: 'none' }}>Animais</Link>
          <Link to="/cuidados" style={{ color: 'white', textDecoration: 'none' }}>Cuidados</Link>
          
          <button 
            type="button"
            onClick={() => setShowLogoutModal(true)} 
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Modal de Confirmação de Logout */}
      {showLogoutModal && (
        <Modal onClose={() => setShowLogoutModal(false)} title="Confirmar Saída">
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Tem certeza que deseja sair da selva?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button className="btn btn-outline" onClick={() => setShowLogoutModal(false)}>
                Permanecer
              </button>
              <button className="btn btn-danger" onClick={handleLogoutConfirm}>
                Sair Agora
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Navbar;