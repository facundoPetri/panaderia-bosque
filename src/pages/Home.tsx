import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { lighten, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    list: {
      marginRight: '25%',
      marginLeft: '25%',
      width: '50%',
      marginBottom: '1rem',
      border: `1px solid ${theme.palette.primary.main}`,
      '& li': {
        '&:hover': {
          backgroundColor: `${lighten(theme.palette.primary.main, 0.8)}`,
        },
      },
    },
    title: {
      textAlign: 'center',
      marginTop: '2rem',
      ':last-child': {
        marginTop: '1rem',
      },
    },
  }
})


const getExample = async () => {
  try {
    const response = await axios.get('http://localhost:3000/recipes')
    console.log(response)
  } catch (error) {
    console.error(error)
  }

}

function Home() {
  const classes = useStyles()
  const navigate = useNavigate()
  const handleOpenView = (path: string = '/') => navigate(path)

  useEffect(() => {
    getExample()
  }, [])
  
  return (
    <div>
      <Typography className={classes.title}>Datos mas relevantes</Typography>
      <div className={classes.wrapper}>
        <div className="section1">
          <Typography className={classes.title}>
            Insumos próximos a vencer
          </Typography>
          <List className={classes.list}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((value) => {
              const labelId = `checkbox-list-label-${value}`
              return (
                <ListItem key={value} role={undefined} dense button>
                  <ListItemText id={labelId} primary={`Insumo ${value + 1}`} />{' '}
                  <ListItemText id={labelId} primary={` ${value + 1} dias`} />
                  <ListItemSecondaryAction>
                    <IconButton
                      title="Ver detalle"
                      edge="end"
                      onClick={() => handleOpenView('/insumos')} //Todo: /insumos/id
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })}
          </List>
        </div>
        <div className="section1">
          <Typography className={classes.title}>
            Insumos con bajo stock
          </Typography>
          <List className={classes.list}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((value) => {
              const labelId = `checkbox-list-label-${value}`
              return (
                <ListItem key={value} role={undefined} dense button>
                  <ListItemText id={labelId} primary={`Insumo ${value + 1}`} />
                  <ListItemText
                    id={labelId}
                    primary={`${value + 1} unidades`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      title="Ver detalle"
                      onClick={() => handleOpenView('/insumos')} //Todo: /insumos/id
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })}
          </List>
        </div>
      </div>
    </div>
  )
}

export default Home
