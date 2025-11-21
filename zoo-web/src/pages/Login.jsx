import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext'; 

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Chama a API
      const res = await api.post('/Auth/login', { email, senha });
      // Usa a função do contexto para atualizar o estado global
      login(res.data.nome, res.data.token, res.data.id);
     
      navigate('/animais');
    } catch (error) {
      console.error(error);
      alert('Falha ao entrar. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 style={{ color: 'var(--jungle-dark)', marginBottom: '10px' }}>🦁 ZooManager</h1>
        <h3 style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>Bem-vindo à selva</h3>
        
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Seu E-mail" 
            className="input-field"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Sua Senha" 
            className="input-field"
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            required 
          />
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '20px', height: '45px' }} 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Acessar Sistema'}
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
          Ainda não é um guardião? <Link to="/register" style={{ color: 'var(--jungle-mid)', fontWeight: 'bold' }}>Cadastre-se aqui</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;