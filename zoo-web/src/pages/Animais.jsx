import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Container, Typography, Button, Card, CardContent, CardActions, 
  Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip 
} from '@mui/material';

function Animais() {
  const [animais, setAnimais] = useState([]);
  const [open, setOpen] = useState(false); // Controla se o modal está aberto ou fechado
  
  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [habitat, setHabitat] = useState('');
  const [paisOrigem, setPaisOrigem] = useState('');

  // Pega o ID do usuário logado (salvo no Login.jsx)
  const usuarioId = localStorage.getItem('usuarioId'); 

  // 1. BUSCAR 
  const loadAnimais = () => {
    api.get('/Animal')
      .then(response => setAnimais(response.data))
      .catch(error => console.error("Erro ao buscar:", error));
  };

  useEffect(() => {
    loadAnimais();
  }, []);

  // 2. CADASTRAR 
  const handleCadastro = async () => {
    const novoAnimal = {
      nome,
      descricao,
      habitat,
      paisOrigem,
      usuarioId: parseInt(usuarioId) 
    };

    try {
      await api.post('/Animal', novoAnimal);
      alert('Animal cadastrado com sucesso!');
      setOpen(false); // Fecha o modal
      loadAnimais();  // Recarrega a lista na hora
      
      // Limpa os campos
      setNome('');
      setDescricao('');
      setHabitat('');
      setPaisOrigem('');
    } catch (error) {
      alert('Erro ao cadastrar. Verifique se você está logado.');
    }
  };

  // 3. DELETAR (DELETE)
  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
      try {
        await api.delete(`/Animal/${id}`);
        loadAnimais(); // Atualiza a lista
      } catch (error) {
        alert('Erro ao excluir.');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Cabeçalho com Botão de Novo */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          🐾 Meus Animais
        </Typography>
        <Button variant="contained" color="success" onClick={() => setOpen(true)}>
          + Novo Animal
        </Button>
      </Grid>

      {/* Lista de Cards */}
      <Grid container spacing={3}>
        {animais.map((animal) => (
          <Grid item xs={12} sm={6} md={4} key={animal.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {animal.nome}
                </Typography>
                
                <Chip label={animal.habitat} color="primary" size="small" variant="outlined" sx={{ mr: 1 }} />
                <Chip label={animal.paisOrigem} color="warning" size="small" variant="outlined" />

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {animal.descricao}
                </Typography>
                
                <Typography variant="caption" display="block" sx={{ mt: 2, color: '#aaa' }}>
                  Dono: {animal.usuario?.nome}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="error" onClick={() => handleDelete(animal.id)}>
                  Excluir
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* MODAL (Formulário Flutuante) */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Cadastrar Novo Animal</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus margin="dense" label="Nome do Animal" fullWidth variant="outlined" 
            value={nome} onChange={e => setNome(e.target.value)} 
          />
          <TextField 
            margin="dense" label="Descrição" fullWidth variant="outlined" multiline rows={2}
            value={descricao} onChange={e => setDescricao(e.target.value)} 
          />
          <TextField 
            margin="dense" label="Habitat (ex: Floresta)" fullWidth variant="outlined" 
            value={habitat} onChange={e => setHabitat(e.target.value)} 
          />
          <TextField 
            margin="dense" label="País de Origem" fullWidth variant="outlined" 
            value={paisOrigem} onChange={e => setPaisOrigem(e.target.value)} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleCadastro} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Animais;