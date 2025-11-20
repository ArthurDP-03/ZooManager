import { useState, useEffect } from 'react';
import api from '../services/api';
import { Container, Typography, List, ListItem, ListItemText, Paper, Chip } from '@mui/material';

function Cuidados() {
  const [cuidados, setCuidados] = useState([]);

  useEffect(() => {
    api.get('/Cuidado')
      .then(response => setCuidados(response.data))
      .catch(error => console.error("Erro:", error));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📋 Rotina de Cuidados</Typography>
      
      <Paper elevation={2}>
        <List>
          {cuidados.map((cuidado) => (
            <ListItem key={cuidado.id} divider>
              <ListItemText 
                primary={cuidado.nome} 
                secondary={
                    <>
                        <Typography component="span" variant="body2" color="text.primary">
                            Frequência: {cuidado.frequencia}
                        </Typography>
                        <br />
                        {cuidado.descricao}
                    </>
                }
              />
              {/* Mostra o nome do animal se ele vier da API */}
              {cuidado.animal && (
                  <Chip label={`Animal: ${cuidado.animal.nome}`} color="primary" variant="outlined" />
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Cuidados;