import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNome');
    navigate('/'); 
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          🦁 ZooManager
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/animais">Animais</Button>
          <Button color="inherit" component={Link} to="/cuidados">Cuidados</Button>
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>Sair</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;