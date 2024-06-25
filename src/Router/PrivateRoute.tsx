import { ComponentType, useState } from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  component: ComponentType<any>
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const [logged, setLogged] = useState(false)

  return logged ? <Component /> : <Navigate to={'/auth/'} />
}

export default PrivateRoute
