import { Route, Routes } from 'react-router-dom'

import { CssBaseline, makeStyles } from '@material-ui/core'

import Sidebar from '../components/Sidebar'
import Home from '../pages/Home'
import Recipes from '../pages/Recipes'
const useStyles = makeStyles({
  wrapper: {
    marginTop: '2rem',
  },
})

const AppPage = () => {
  const classes = useStyles()
  return (
    <div>
      <CssBaseline />
      <Sidebar />
      <div className={classes.wrapper}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
        </Routes>
      </div>
    </div>
  )
}

export default AppPage
