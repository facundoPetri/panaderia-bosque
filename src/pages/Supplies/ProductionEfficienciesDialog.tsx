import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  makeStyles,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import esLocale from 'date-fns/locale/es'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { RecipesResponse } from '../../interfaces/Recipes'
import {
  validateDate,
  validateSpecificNumber,
  validateText,
} from '../../utils/validateData'
import { requestToast } from '../../common/request'
import { MachinesResponse } from '../../interfaces/Machines'

interface ProductionEfficienciesDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: Record<string, any>) => void
  recipes: RecipesResponse[]
}

const useStyles = makeStyles(() => ({
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: '0.75rem',
    color: 'gray',
  },
}))
interface FormDataToSend {
  inital_date: Date
  final_date: Date
  observations: string
  quantity: number
  equipment: string[]
  recipe: string
  total_time: number
}
const ProductionEfficienciesDialog: React.FC<
  ProductionEfficienciesDialogProps
> = ({ open, onClose, onSave, recipes }) => {
  const classes = useStyles()

  const [formData, setFormData] = useState({
    inital_date: new Date(),
    final_date: new Date(),
    observations: '',
    quantity: '',
    equipment: [],
    recipe: recipes[0]?._id || '',
    total_time: 1,
  })
  const [machines, setMachines] = useState<MachinesResponse[]>([])

  const selectedRecipe = recipes.find(
    (recipe) => recipe._id === formData.recipe
  )

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const isDateValid = validateDate(formData.inital_date, formData.final_date)
    const isObservations = validateText(
      formData.observations,
      { maxLength: 500 },
      'Comentarios y observaciones'
    )
    const isUnitsMade = validateSpecificNumber(
      Number(formData.quantity),
      { min: 1 },
      'Cantidad de unidades fabricadas'
    )

    return isDateValid && isObservations && isUnitsMade
  }

  const handleSave = () => {
    if (!validateForm()) return
    const newData: FormDataToSend = {
      inital_date: formData.inital_date,
      final_date: formData.final_date,
      quantity: Number(formData.quantity),
      observations: formData.observations,
      equipment: formData.equipment,
      recipe: formData.recipe,
      total_time:formData.total_time
    }
    onSave(newData)
  }
  const getMachines = async () => {
    try {
      const res = await requestToast<MachinesResponse[]>({
        path: '/machines',
        method: 'GET',
        successMessage: 'Maquinarias cargadas',
        errorMessage: 'Error al cargar maquinarias',
        pendingMessage: 'Cargando maquinarias...',
      })
      if (res) {
        setMachines(res)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getMachines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Informe de Receta</h3>
        <FontAwesomeIcon
          icon={faTimes}
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="recipe-select-label">Receta</InputLabel>
              <Select
                labelId="recipe-select-label"
                value={formData.recipe}
                onChange={(e) =>
                  handleFieldChange('recipe', [
                    ...formData.equipment,
                    e.target.value as string,
                  ])
                }
                label="Receta"
              >
                {recipes.map((recipe) => (
                  <MenuItem key={recipe._id} value={recipe._id}>
                    {recipe.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
              <KeyboardDatePicker
                label="Desde"
                format="dd/MM/yyyy"
                value={formData.inital_date}
                onChange={(date) => handleFieldChange('inital_date', date!)}
                fullWidth
                inputVariant="outlined"
                margin="normal"
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
              <KeyboardDatePicker
                label="Hasta"
                format="dd/MM/yyyy"
                value={formData.final_date}
                onChange={(date) => handleFieldChange('final_date', date!)}
                fullWidth
                inputVariant="outlined"
                margin="normal"
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tiempo total en minutos"
              type="number"
              value={formData.total_time}
              onChange={(e) =>
                handleFieldChange('total_time', Number(e.target.value))
              }
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Ingredientes
            </Typography>
            <Typography variant="body2" color="textPrimary">
              {selectedRecipe?.supplies
                ?.flatMap((supply) => supply.name.split(','))
                .map((ingredient) => ingredient.trim())
                .join(', ') || 'No hay ingredientes para mostrar.'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Comentarios y observaciones"
              value={formData.observations}
              onChange={(e) =>
                handleFieldChange('observations', e.target.value)
              }
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              margin="normal"
            />
            <FormHelperText className={classes.characterCount}>
              {`${formData.observations.length}/500`}
            </FormHelperText>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cantidad de unidades fabricadas"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleFieldChange('quantity', e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="machines">Maquinarias y utensillos</InputLabel>
              <Select
                labelId="machines"
                value={formData.equipment}
                onChange={(e) =>
                  handleFieldChange('equipment', e.target.value as string)
                }
                label="Maquinarias y utensillos"
                multiple
              >
                {machines.map((machine) => (
                  <MenuItem key={machine._id} value={machine._id}>
                    {machine.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductionEfficienciesDialog
