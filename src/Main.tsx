import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@material-ui/core'
import Routes from './Router/Routes'
import basicTheme from './theme/basicTheme'
import { AuthProvider } from './stores/AuthContext'
function Main() {
  const usedTheme = createTheme(basicTheme)
  return (
    <AuthProvider>
    <Router>
      <ThemeProvider theme={usedTheme}>
        <Routes />
      </ThemeProvider>
    </Router>
    </AuthProvider>
  )
}

export default Main
