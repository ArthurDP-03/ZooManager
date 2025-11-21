import { Navigate } from 'react-router-dom';

// Este componente recebe o "children" (a página que você quer acessar)
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // Se NÃO tem token, manda pro Login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se tem token, deixa passar e mostra a página
  return children;
}

export default ProtectedRoute;