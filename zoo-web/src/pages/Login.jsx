import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/Auth/login', { email, senha });

      const { nome, id, token } = response.data;

      if (token) {
          login(nome, token, id);
      } else {
          login(nome, id); 
      }

      navigate('/animais');

    } catch (err) {
      console.error("Erro no login:", err);
      // Mensagem de erro amigável
      if (err.response && err.response.status === 401) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Cabeçalho do Card */}
        <h1 style={{ color: 'var(--jungle-dark)', marginBottom: '10px', fontWeight: 'bold' }}>
          🦁 ZooManager
        </h1>
        <h3 style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem', fontWeight: 'normal' }}>
          Bem-vindo à selva
        </h3>

        {/* Exibição de Erros */}
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '0.9rem',
            border: '1px solid #ef9a9a'
          }}>
            {error}
          </div>
        )}
        
        {/* Formulário */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="email" 
              placeholder="Seu E-mail" 
              className="input-field"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              autoComplete="email"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="password" 
              placeholder="Sua Senha" 
              className="input-field"
              value={senha} 
              onChange={e => setSenha(e.target.value)} 
              required 
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', height: '45px', fontSize: '1rem' }} 
            disabled={loading}
          >
            {loading ? 'Validando...' : 'Acessar Sistema'}
          </button>
        </form>
        
        {/* Rodapé do Card */}
        <p style={{ marginTop: '25px', fontSize: '0.9rem', color: '#666' }}>
          Ainda não é um guardião?{' '}
          <Link to="/register" style={{ color: 'var(--jungle-mid)', fontWeight: 'bold', textDecoration: 'none' }}>
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;