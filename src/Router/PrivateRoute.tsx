import { ComponentType } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../stores/AuthContext'

interface PrivateRouteProps {
  component: ComponentType<any>
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const { token } = useAuth();
  
  return token ? <Component /> : <Navigate to={'/auth/'} />
}

export default PrivateRoute
