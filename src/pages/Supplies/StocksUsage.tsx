import { useState, useEffect } from 'react'

import {
  Box,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'

import GenericTable from '../../components/GenericTable'
import { Column } from '../../components/GenericTable'
import { SupplyUsage } from '../../interfaces/Supplies'
import { request, requestToast } from '../../common/request'
import GenericDialog from '../../components/GenericDIalog'
import { RecipesResponse } from '../../interfaces/Recipes'
import { SupplyUsageToSend } from '../../common/types'
import { formatISODateString } from '../../utils/dateUtils'
import { toast, ToastContainer } from 'react-toastify'

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
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

const columns: Column<SupplyUsage>[] = [
  { id: '_id', label: 'id', hiddenColumn: true, sortable: false },
  { id: 'supply', label: 'Nombre' },
  { id: 'date_used', label: 'Fecha de Uso' },
  { id: 'quantity', label: 'Cantidad' },
]

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function StocksUsage() {
  const classes = useStyles()
  const [suppliesLog, setSuppliesLog] = useState<SupplyUsage[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipesResponse | null>(
    null
  )
  const [recipes, setRecipes] = useState<RecipesResponse[]>([])
  const [supplyUsage, setSupplyUsage] = useState<SupplyUsageToSend[]>([])

  const getSuppliesUsageLog = async () => {
    try {
      const res = await request<SupplyUsage[]>({
        path: `/supplies-usage`,
        method: 'GET',
      })
      if (res) {
        setSuppliesLog(res)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onAdd = () => {
    setOpenDialog(true)
  }
  const transformedData = () => {
    return suppliesLog.map((supplyLog) => ({
      ...supplyLog,
      supply: supplyLog.supply.name,
      date_used: formatISODateString(supplyLog.date_used),
    }))
  }
  const handleCancel = () => {
    handleCloseDialog()
    setSupplyUsage([])
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedRecipe(null)
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
      if (error instanceof Error)
        toast.error((error as any).response?.data.message || error.message, {
          autoClose: false,
        })
      else console.error('An unknown error occurred')
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
    toast.promise(Promise.all([getRecipes(), getSuppliesUsageLog()]), {
      pending: 'Cargando insumos...',
      success: 'insumos cargados',
      error: 'Error al cargar insumos',
    })
  }, [])

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
    <div style={{ padding: '20px' }}>
      <h1>Registro de uso de insumos</h1>
      <Typography variant="h6">Historial de uso de insumos</Typography>
      <Typography variant="body1">
        Los insumos registrados se descontarán del stock disponible, priorizando
        aquellos con fecha de vencimiento más próxima
      </Typography>
      <GenericTable
        columns={columns as any}
        data={transformedData() || []}
        dropdownOptions={dropdownOptions}
        onAdd={onAdd}
        showDropdown={false}
        nameColumnId="supply"
        hiddenButtonModal={false}
      />
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
      <ToastContainer />
    </div>
  )
}
