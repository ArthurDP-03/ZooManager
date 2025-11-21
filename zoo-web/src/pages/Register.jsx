import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) return alert("Senhas não conferem!");

    try {
      await api.post('/Auth/registro', formData);
      alert('Cadastro realizado! Faça login.');
      navigate('/');
    } catch (error) {
      alert('Erro ao cadastrar: ' + error.response?.data || 'Tente novamente.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 style={{ color: 'var(--jungle-dark)', marginBottom: '10px' }}>🌿 Novo Guardião</h2>
        <form onSubmit={handleRegister}>
          <input name="nome" placeholder="Nome Completo" className="input-field" onChange={handleChange} required />
          <input name="email" type="email" placeholder="E-mail" className="input-field" onChange={handleChange} required />
          <input name="senha" type="password" placeholder="Senha" className="input-field" onChange={handleChange} required />
          <input name="confirmarSenha" type="password" placeholder="Confirmar Senha" className="input-field" onChange={handleChange} required />
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>Criar Conta</button>
        </form>
        <p style={{ marginTop: '15px' }}>
          <Link to="/" style={{ color: 'var(--jungle-mid)' }}>Voltar ao Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;