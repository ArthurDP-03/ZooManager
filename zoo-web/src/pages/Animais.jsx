import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Container, Typography, Button, Card, CardContent, CardActions, 
  Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, MenuItem 
} from '@mui/material';

function Animais() {
  const [animais, setAnimais] = useState([]);
  const [open, setOpen] = useState(false); 

  // Listas de apoio (Catálogo)
  const [listaEspecies, setListaEspecies] = useState([]);
  const [listaHabitats, setListaHabitats] = useState([]);

  // Form States
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [especieId, setEspecieId] = useState(''); // Guarda o ID numérico
  const [habitatId, setHabitatId] = useState(''); // Guarda o ID numérico
  const [paisOrigem, setPaisOrigem] = useState('');

  const usuarioId = localStorage.getItem('usuarioId'); 

  const loadData = async () => {
    try {
        // Carrega tudo em paralelo
        const [resAnimais, resEspecies, resHabitats] = await Promise.all([
            api.get('/Animal'),
            api.get('/Catalogos/especies'),
            api.get('/Catalogos/habitats')
        ]);
        setAnimais(resAnimais.data);
        setListaEspecies(resEspecies.data);
        setListaHabitats(resHabitats.data);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCadastro = async () => {
    const novoAnimal = {
      nome,
      descricao,
      especieId: parseInt(especieId), // Envia ID
      habitatId: parseInt(habitatId), // Envia ID
      paisOrigem,
      usuarioId: parseInt(usuarioId) 
    };

    try {
      await api.post('/Animal', novoAnimal);
      alert('Animal salvo!');
      setOpen(false);
      loadData();
      // Limpa
      setNome(''); setDescricao(''); setEspecieId(''); setHabitatId(''); setPaisOrigem('');
    } catch (error) {
      alert('Erro ao salvar.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Excluir animal?")) {
      await api.delete(`/Animal/${id}`);
      loadData();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4">🐾 Meus Animais</Typography>
        <Button variant="contained" color="success" onClick={() => setOpen(true)}>+ Novo Animal</Button>
      </Grid>

      <Grid container spacing={3}>
        {animais.map((animal) => (
          <Grid item xs={12} sm={6} md={4} key={animal.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5">{animal.nome}</Typography>
                
                {/* Exibe o Nome vindo do ResponseDto */}
                <Typography variant="subtitle1" color="text.primary">
                    {animal.especie}
                </Typography>
                
                <Chip label={animal.habitat} color="primary" size="small" variant="outlined" sx={{ mr: 1, mt: 1 }} />
                <Chip label={animal.paisOrigem} color="warning" size="small" variant="outlined" sx={{ mt: 1 }} />

                <Typography variant="body2" sx={{ mt: 2 }}>{animal.descricao}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="error" onClick={() => handleDelete(animal.id)}>Excluir</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Cadastrar Animal</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nome" fullWidth value={nome} onChange={e => setNome(e.target.value)} />
          
          {/* SELECT PARA ESPÉCIE */}
          <TextField
            select
            margin="dense"
            label="Espécie"
            fullWidth
            value={especieId}
            onChange={(e) => setEspecieId(e.target.value)}
          >
            {listaEspecies.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.nome}
              </MenuItem>
            ))}
          </TextField>

          {/* SELECT PARA HABITAT */}
          <TextField
            select
            margin="dense"
            label="Habitat"
            fullWidth
            value={habitatId}
            onChange={(e) => setHabitatId(e.target.value)}
          >
            {listaHabitats.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.nome}
              </MenuItem>
            ))}
          </TextField>

          <TextField margin="dense" label="País de Origem" fullWidth value={paisOrigem} onChange={e => setPaisOrigem(e.target.value)} />
          <TextField margin="dense" label="Descrição" fullWidth multiline rows={2} value={descricao} onChange={e => setDescricao(e.target.value)} />
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