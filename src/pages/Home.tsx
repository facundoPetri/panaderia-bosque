import { useEffect, useState } from 'react'

import { lighten, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  TextField,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import GenericDialog from '../components/GenericDIalog'
import { SuppliesResponse, SupplyUsage } from '../interfaces/Supplies'
import { request, requestToast } from '../common/request'
import { formatISODateString } from '../utils/dateUtils'
import { getSupplyUnit } from '../utils/getSupplyUnit'
import { RecipesResponse } from '../interfaces/Recipes'

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    list: {
      marginRight: '25%',
      marginLeft: '25%',
      marginTop: '1rem',
      width: '50%',
      marginBottom: '1rem',
      paddingTop: '0px',
      border: `1px solid ${theme.palette.primary.main}`,
      '& li': {
        '&:hover': {
          backgroundColor: `${lighten(theme.palette.primary.main, 0.8)}`,
        },
      },
    },
    title: {
      textAlign: 'center',
    },
    suppliesWrapper: {
      marginTop: '1rem',
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '1rem',
    },
    button: {
      marginLeft: '1rem',
    },
    header: {
      backgroundColor: theme.palette.primary.main,
    },
    listItem: {
      width: '33.3%',
    },
    headerWrapper: {
      display: 'flex',
      alignItems: 'center',

      marginLeft: '30%',
    },
    bottomWrapper: {
      flexDirection: 'column',
    },
    lastSupply: {
      width: '500px',
    },
    cardWrappers: {
      display: 'flex',
      marginTop: '1rem',
    },
    card: {
      width: '200px',
      margin: '0px 1rem',
    },
  }
})
interface SupplyUsageToSend {
  supply: string
  quantity: number
  date_used: string
}
const filterDaysOptions = [
  { days: 1, label: 'hoy' },
  { days: 7, label: 'esta semana' },
]
function Home() {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [suppliesLog, setSuppliesLog] = useState<SupplyUsage[]>([])
  const [recipes, setRecipes] = useState<RecipesResponse[]>([])
  const [filterDays, setFilterDays] = useState(1)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipesResponse | null>(
    null
  )
  const [supplyUsage, setSupplyUsage] = useState<SupplyUsageToSend[]>([])
  const getSupplies = async () => {
    try {
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
      })
      if (res) {
        setSupplies(res)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getSuppliesUsageLog = async () => {
    try {
      const res = await request<SupplyUsage[]>({
        path: `/supplies-usage?filterDays=${filterDays}`,
        method: 'GET',
      })
      if (res) {
        setSuppliesLog(res)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedRecipe(null)
  }
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }
  const handleCancel = () => {
    handleCloseDialog()
    setSupplyUsage([])
  }
  const handleConfirm = async () => {
    try {
      const res = await requestToast<any[]>({
        path: '/supplies-usage',
        method: 'POST',
        data: supplyUsage,
        successMessage: 'Registro cargado',
        errorMessage: 'Error al cargar registro',
        pendingMessage: 'Cargando registro...',
      })
      if (res) {
        getSuppliesUsageLog()
      }
    } catch (error) {
      console.error(error)
    }
    handleCancel()
  }
  const getRecipes = async () => {
    try {
      const res = await request<RecipesResponse[]>({
        path: '/recipes',
        method: 'GET',
      })
      if (res) {
        setRecipes(res)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getSupplies()
    getRecipes()
  }, [])
  useEffect(() => {
    getSuppliesUsageLog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDays])
  const handleChangeQuantity = (value: string, supplyId: string) => {
    setSupplyUsage((prev) => {
      const existingSupply = prev.find((item) => item.supply === supplyId)

      if (existingSupply) {
        return prev.map((item) =>
          item.supply === supplyId ? { ...item, quantity: Number(value) } : item
        )
      } else {
        return [
          ...prev,
          {
            supply: supplyId,
            quantity: Number(value),
            date_used: new Date().toISOString(),
          },
        ]
      }
    })
  }
  return (
    <div>
      <Typography className={classes.title}>Datos mas relevantes</Typography>
      <div className={classes.wrapper}>
        <div className="section1">
          <Box className={classes.container}>
            <Box className={classes.headerWrapper}>
              <Typography className={classes.lastSupply}>
                Ultimos insumos usados
              </Typography>
              <Select
                fullWidth
                labelId="recetasSelector"
                name="recipes"
                value={filterDays}
                onChange={(e) => setFilterDays(Number(e.target.value))}
                input={<Input />}
              >
                {filterDaysOptions.map((filter) => (
                  <MenuItem key={filter.days} value={filter.days}>
                    {filter.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              onClick={() => handleOpenDialog()}
              endIcon={<FontAwesomeIcon icon={faPlus} />}
            >
              Agregar uso de insumo
            </Button>
          </Box>
          <List className={classes.list}>
            <ListItem dense className={classes.header}>
              <ListItemText primary={'Insumo'} />{' '}
              <ListItemText primary={'Fecha'} />
              <ListItemText primary={'Cantidad'} />
            </ListItem>
            {suppliesLog.map((value) => {
              const labelId = `checkbox-list-label-${value}`
              return (
                <ListItem key={value._id} dense>
                  <ListItemText
                    className={classes.listItem}
                    id={labelId}
                    primary={value.supply.name}
                  />{' '}
                  <ListItemText
                    className={classes.listItem}
                    id={labelId}
                    primary={formatISODateString(value.date_used)}
                  />
                  <ListItemText
                    className={classes.listItem}
                    id={labelId}
                    primary={`${value.quantity} ${getSupplyUnit(
                      value.supply._id,
                      supplies
                    )}`}
                  />
                </ListItem>
              )
            })}
          </List>
          <Box className={classes.container}>
            <Box
              className={`${classes.headerWrapper} ${classes.bottomWrapper}`}
            >
              <Typography>Pedidos a proveedores pendientes</Typography>
              <Box className={classes.cardWrappers}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography gutterBottom>10/11/2024</Typography>
                    <Typography variant="h5" component="div">
                      Pedido 1
                    </Typography>
                    <Typography>Bimbo</Typography>
                    <Typography variant="body2">Pan de hamburguesa</Typography>
                    <Typography variant="body2">Pan Lactal</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Ver pedido</Button>
                  </CardActions>
                </Card>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography gutterBottom>10/11/2024</Typography>
                    <Typography variant="h5" component="div">
                      Pedido 1
                    </Typography>
                    <Typography>Bimbo</Typography>
                    <Typography variant="body2">Pan de hamburguesa</Typography>
                    <Typography variant="body2">Pan Lactal</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Ver pedido</Button>
                  </CardActions>
                </Card>{' '}
                <Card className={classes.card}>
                  <CardContent>
                    <Typography gutterBottom>10/11/2024</Typography>
                    <Typography variant="h5" component="div">
                      Pedido 1
                    </Typography>
                    <Typography>Bimbo</Typography>
                    <Typography variant="body2">Pan de hamburguesa</Typography>
                    <Typography variant="body2">Pan Lactal</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Ver pedido</Button>
                  </CardActions>
                </Card>
              </Box>
            </Box>
          </Box>
        </div>
      </div>
      <GenericDialog
        title="Agregar uso de insumo"
        open={openDialog}
        handleClose={handleCloseDialog}
        content={
          <div>
            <FormControl fullWidth>
              <InputLabel id="recetasSelector">Recetas</InputLabel>
              <Select
                labelId="recetasSelector"
                name="recipes"
                value={selectedRecipe?._id || ''}
                onChange={(e) =>
                  setSelectedRecipe(
                    recipes.find((r) => r._id === (e.target.value as string)) ||
                      null
                  )
                }
                label="Insumos"
                input={<Input />}
                fullWidth
              >
                {recipes.map((recipe) => (
                  <MenuItem key={recipe._id} value={recipe._id}>
                    {recipe.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedRecipe && (
              <>
                {selectedRecipe.supplies.map((supply) => (
                  <Box className={classes.suppliesWrapper}>
                    <Typography>{`${supply.name} (${supply.unit})`}</Typography>
                    <TextField
                      margin="dense"
                      label="Cantidad"
                      type="number"
                      fullWidth
                      value={
                        supplyUsage.find((item) => item.supply === supply._id)
                          ?.quantity || 0
                      }
                      onChange={(e) =>
                        handleChangeQuantity(e.target.value, supply._id)
                      }
                    />
                  </Box>
                ))}
              </>
            )}
          </div>
        }
        primaryButtonAction={handleConfirm}
        primaryButtonTitle="Confirmar"
        secondaryButtonTitle="Cancelar"
        secondaryButtonAction={handleCancel}
      />
    </div>
  )
}

export default Home
