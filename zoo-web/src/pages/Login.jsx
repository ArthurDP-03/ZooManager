import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/Auth/login', { email, senha });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuarioId', res.data.id);
      navigate('/animais');
    } catch (error) {
      alert('Erro no login: Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 style={{ color: 'var(--jungle-dark)', marginBottom: '20px' }}>🦁 ZooManager</h1>
        <h3 style={{ color: '#666', marginBottom: '20px' }}>Bem-vindo de volta</h3>
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" placeholder="Seu E-mail" className="input-field"
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Sua Senha" className="input-field"
            value={senha} onChange={e => setSenha(e.target.value)} required 
          />
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar na Selva'}
          </button>
        </form>
        
        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          Não tem conta? <Link to="/register" style={{ color: 'var(--jungle-mid)' }}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;