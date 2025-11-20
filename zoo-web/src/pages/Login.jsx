import { useState } from 'react';
import api from '../services/api';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Chama o novo endpoint que criamos no C#
      const response = await api.post('/Usuario/login', { nome: "login", email, senha });
      
      // Salva o ID do usuário no navegador para usar depois
      localStorage.setItem('usuarioId', response.data.id);
      localStorage.setItem('usuarioNome', response.data.nome);

      navigate('/animais'); // Vai para a área logada
    } catch (error) {
      alert('Email ou senha inválidos!');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>🦁 ZooManager</Typography>
        <Typography variant="h6">Login</Typography>
        
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2, width: '100%' }}>
          <TextField label="E-mail" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Senha" type="password" fullWidth margin="normal" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Entrar</Button>
          <Button component={Link} to="/cadastro" fullWidth color="inherit">Criar conta</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;