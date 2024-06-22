import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@material-ui/core'
import Routes from './Router/Routes'
import basicTheme from './theme/basicTheme'
function Main() {
  const usedTheme = createTheme(basicTheme)
  return (
    <Router>
      <ThemeProvider theme={usedTheme}>
        <Routes />
      </ThemeProvider>
    </Router>
  )
}

export default Main
