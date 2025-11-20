import { useState } from 'react';
import api from '../services/api';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      await api.post('/Usuario', { nome, email, senha });
      alert('Usuário cadastrado com sucesso!');
      navigate('/'); // Manda para o Login
    } catch (error) {
      alert('Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">🦁 Criar Conta</Typography>
        <Box component="form" onSubmit={handleCadastro} sx={{ mt: 2, width: '100%' }}>
          <TextField label="Nome" fullWidth margin="normal" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <TextField label="E-mail" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Senha" type="password" fullWidth margin="normal" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Cadastrar</Button>
          <Button component={Link} to="/" fullWidth color="inherit">Já tenho conta</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Cadastro;