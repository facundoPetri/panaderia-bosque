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
  Grid,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faFileAlt,
  faHourglassHalf,
  faPlus,
  faTimesCircle,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons'

import GenericDialog from '../components/GenericDIalog'
import { SuppliesResponse, SupplyUsage, TransformedBatch } from '../interfaces/Supplies'
import { request, requestToast } from '../common/request'
import { formatISODateString } from '../utils/dateUtils'
import { getSupplyUnit } from '../utils/getSupplyUnit'
import { RecipesResponse } from '../interfaces/Recipes'
import { SupplyUsageToSend } from '../common/types'
import { OrderResponse, OrderState } from '../interfaces/Orders'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { Batch as BatchResponse } from '../interfaces/Batch'

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
    shortCutsButton: {
      width: '100%',
      height: '200px',
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
      width: '50%',
      flexWrap: 'wrap',
      gap: '1rem',
      marginLeft: '2rem',
      marginBottom: '1rem',
    },
    card: {
      width: '200px',
    },
    ordersTitle: {
      textAlign: 'center',
    },
    verDetalles: {
      '& span': {
        display: 'block',
        width: '100%',
        textAlign: 'left',
      },
    },
    username: {
      fontWeight: 'bold',
    },
  }
})
const filterDaysOptions = [
  { days: 1, label: 'hoy' },
  { days: 7, label: 'esta semana' },
]
function Home() {
  const classes = useStyles()
  const navigate = useNavigate()
  const [openDialog, setOpenDialog] = useState(false)
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [suppliesLog, setSuppliesLog] = useState<SupplyUsage[]>([])
  const [recipes, setRecipes] = useState<RecipesResponse[]>([])
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [filterDays, setFilterDays] = useState(1)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipesResponse | null>(
    null
  )
  const [supplyUsage, setSupplyUsage] = useState<SupplyUsageToSend[]>([])
  const [hasShownToast, setHasShownToast] = useState(false);
  const [batches, setBatches] = useState<TransformedBatch[]>([])
  const fullname = sessionStorage.getItem('fullname')
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
      toast.error(
        (error as any).response?.data.message || 'Ocurrió un error!',
        {
          autoClose: false,
        }
      )
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
  const checkLowStockSupplies = () => {
    if (hasShownToast) return;

    const lowStockSupplies = supplies.filter(
      (supply) => supply?.current_stock < supply?.min_stock
    );

    if (lowStockSupplies.length > 0) {
      const message = (
        <div>
          <strong>Insumos con stock crítico:</strong>
          <br />
          {lowStockSupplies.map((supply) => (
            <div key={supply._id}>
              {supply.name} (Stock actual: {supply.current_stock})
            </div>
          ))}
        </div>
      );

      toast.error(message, {
        autoClose: false,
        style: { whiteSpace: 'pre-line' },
      });

      setHasShownToast(true);
    }
  };
  const showExpiringBatchesToast = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const expiringBatches = batches.filter((batch) => {
      const expirationDate = new Date(batch.expiration_date);
      console.log(expirationDate, today, nextWeek);
      return expirationDate >= today && expirationDate <= nextWeek;
    });

    if (expiringBatches.length > 0) {
      const message = (
        <div>
          <strong>Insumos próximos a vencer:</strong>
          <br />
          {expiringBatches.map((batch) => (
            <div key={batch._id}>
              {batch.supply_name} (Vence el: {formatISODateString(batch.expiration_date)})
            </div>
          ))}
        </div>
      );

      toast.warn(message, {
        autoClose: false,
        style: { whiteSpace: 'pre-line' },
      });
    }
  };
  const getBatches = async () => {
    try {
      const res = await request<BatchResponse[]>({
        path: '/batch?expiring=true&days=7',
        method: 'GET',
      })
      if (res) {
        const transformedBatches = res.map((batch) => ({
          ...batch,
          expiration_date: batch.expiration_date,
          supply_name: batch.supply_id?.name ?? 'Sin nombre',
          location: `Fila ${batch.row}, Columna ${batch.column}`,
          quantity: `${batch.quantity} ${batch.supply_id?.unit}`,
        }))
        setBatches(transformedBatches)
      }
    } catch (error) {
      console.error('Error al obtener los insumos:', error)
    }
  }
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
  const getOrders = async () => {
    try {
      const res = await request<OrderResponse[]>({
        path: '/orders',
        method: 'GET',
      })
      if (res) {
        setOrders(res.filter((order) => order.state === OrderState.PENDING))
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error)
    }
  }
  const getStateIcon = (state: OrderState) => {
    switch (state) {
      case OrderState.CREATED:
        return (
          <FontAwesomeIcon
            icon={faFileAlt}
            size="1x"
            color="grey"
            style={{ marginLeft: '.5rem' }}
          />
        )
      case OrderState.PENDING:
        return (
          <FontAwesomeIcon
            icon={faHourglassHalf}
            size="1x"
            color="yellow"
            style={{ marginLeft: '.5rem' }}
          />
        )
      case OrderState.CANCELLED:
        return (
          <FontAwesomeIcon
            icon={faTimesCircle}
            size="1x"
            color="red"
            style={{ marginLeft: '.5rem' }}
          />
        )
      default:
        return (
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="1x"
            color="green"
            style={{ marginLeft: '.5rem' }}
          />
        )
    }
  }
  const navigateToView = (path: string) => {
    navigate(path)
  }
  useEffect(() => {
    getSupplies();
    getRecipes();
    getOrders();
    getSuppliesUsageLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDays]);
  useEffect(() => {
    if (supplies.length > 0) checkLowStockSupplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplies]);
  useEffect(() => {
    if (supplies.length > 0) {
      getBatches()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplies])
  useEffect(() => {
    if (batches.length > 0) {
      showExpiringBatchesToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batches]);
  return (
    <div>
      <ToastContainer />
      <Typography className={classes.title}>
        Bienvenido <span className={classes.username}>{fullname}</span> , ¿Qué
        deseas hacer hoy?
      </Typography>
      <Grid container spacing={2} style={{ padding: '1rem 3rem' }}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.shortCutsButton}
            onClick={() => navigateToView('/recipes')}
            endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
          >
            Consultar una receta
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.shortCutsButton}
            onClick={() => navigateToView('/supplies/lowStock')}
            endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
          >
            Consultar stock de un insumo
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.shortCutsButton}
            onClick={() => navigateToView('/providers/orders')}
            endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
          >
            Realizar un pedido a proveedor
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.shortCutsButton}
            onClick={() => navigateToView('/providers/qualityAndPunctuality')}
            endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
          >
            Cargar informe sobre pedido a proveedor
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.shortCutsButton}
            onClick={() => navigateToView('/supplies/batches')}
            endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
          >
            Consultar lotes de insumo
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.shortCutsButton}
            onClick={() => navigateToView('/supplies/inventoryWaste')}
            endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
          >
            Cargar un informe de desperdicio
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.shortCutsButton}
            onClick={() => navigateToView('/supplies/productionEfficiency')}
            endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
          >
            Cargar un informe de rendimiento de producción
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.shortCutsButton}
            onClick={() => navigateToView('/machinery/maintenance')}
            endIcon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
          >
            Cargar un informe de mantenimiento de maquinaria
          </Button>
        </Grid>
      </Grid>
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
            <Box style={{ width: '100%', border: '2px solid #D6C983' }}>
              <Box>
                <Typography className={classes.ordersTitle}>
                  Pedidos a proveedores pendientes
                </Typography>
              </Box>
              <Box
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box className={classes.cardWrappers}>
                  {orders.map((order) => (
                    <Card className={classes.card} key={order._id}>
                      <CardContent>
                        <Typography gutterBottom>
                          {formatISODateString(order.created_at)}
                        </Typography>
                        <Typography variant="h5" component="div">
                          Pedido {order.number}
                        </Typography>
                        <Typography>{order.provider.name}</Typography>
                        <Typography variant="body2">
                          {order.state}
                          {getStateIcon(order.state)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/providers/orders/${order.number}`)
                          }
                          fullWidth
                          className={classes.verDetalles}
                        >
                          Ver detalles
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </div>
      </div>
      {openDialog && (
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
                      recipes.find(
                        (r) => r._id === (e.target.value as string)
                      ) || null
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
                    <Box className={classes.suppliesWrapper} key={supply._id}>
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
      )}
    </div>
  )
}

export default Home
