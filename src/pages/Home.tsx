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
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import GenericDialog from '../components/GenericDIalog'
import { SuppliesResponse, SupplyUsage } from '../interfaces/Supplies'
import { request, requestToast } from '../common/request'
import { formatISODateString } from '../utils/dateUtils'
import { getSupplyUnit } from '../utils/getSupplyUnit'

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
      paddingTop:'0px',
      border: `1px solid ${theme.palette.primary.main}`,
      '& li': {
        '&:hover': {
          backgroundColor: `${lighten(theme.palette.primary.main, 0.8)}`,
        },
      },
    },
    title: {
      textAlign: 'center',
      ':last-child': {
        marginTop: '1rem',
      },
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '1rem',
    },
    button: {
      marginLeft: '1rem',
    },
    header:{
      backgroundColor:theme.palette.primary.main,
    },
    listItem:{
      width:'33%'
    }
  }
})

function Home() {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [suppliesLog, setSuppliesLog] = useState<SupplyUsage[]>([])
  const [supplyUsage, setSupplyUsage] = useState({
    supply: '',
    quantity: 0,
    date_used: '',
  })
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
        path: '/supplies-usage',
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
  }
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }
  const handleCancel = () => {
    handleCloseDialog()
    setSupplyUsage({
      supply: '',
      quantity: 0,
      date_used: '',
    })
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

  useEffect(() => {
    getSupplies()
    getSuppliesUsageLog()
  }, [])

  return (
    <div>
      <Typography className={classes.title}>Datos mas relevantes</Typography>
      <div className={classes.wrapper}>
        <div className="section1">
          <Box className={classes.container}>
            <Typography className={classes.title}>
              Ultimos insumos usados esta semana
            </Typography>
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
                  <ListItemText className={classes.listItem} id={labelId} primary={value.supply.name} />{' '}
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
        </div>
      </div>
      <GenericDialog
        title="Agregar uso de insumo"
        open={openDialog}
        handleClose={handleCloseDialog}
        content={
          <div>
            <FormControl fullWidth>
              <InputLabel id="insumosSelector">Insumos</InputLabel>
              <Select
                labelId="insumosSelector"
                //className={classes.select}
                name="supplies"
                value={supplyUsage.supply}
                onChange={(e) =>
                  setSupplyUsage((prev) => {
                    return {
                      ...prev,
                      supply: e.target.value as string,
                    }
                  })
                }
                label="Insumos"
                input={<Input />}
                fullWidth
              >
                {supplies.map((sup) => (
                  <MenuItem key={sup._id} value={sup._id}>
                    {sup.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Cantidad"
              type="number"
              fullWidth
              value={supplyUsage.quantity}
              onChange={(e) =>
                setSupplyUsage((prev) => {
                  return {
                    ...prev,
                    quantity: Number(e.target.value),
                  }
                })
              }
            />
            <TextField
              margin="dense"
              label="Fecha de uso"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={supplyUsage.date_used}
              onChange={(e) =>
                setSupplyUsage((prev) => {
                  return {
                    ...prev,
                    date_used: e.target.value,
                  }
                })
              }
            />
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
