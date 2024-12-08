import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { toast } from 'react-toastify'
import { validateGeneralNumber, validateText } from '../../utils/validateData'

const useStyles = makeStyles((theme) => ({
  select: {
    marginTop: '1rem',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
}));

interface RecipeDialogCreateProps {
  open: boolean
  onClose: () => void
  onSave: (recipe: any) => void
  supplies: SuppliesResponse[]
}

const RecipeDialogCreate: React.FC<RecipeDialogCreateProps> = ({
  open,
  onClose,
  onSave,
  supplies,
}) => {
  const classes = useStyles()
  const [formData, setFormData] = useState({
    name: '',
    supplies: [],
    steps: '',
    recommendations: '',
    standardUnits: '',
    avatarUrl: '',
  })

  useEffect(() => {
    if (!open) {
      // Resetear formulario al cerrar el diálogo
      setFormData({
        name: '',
        supplies: [],
        steps: '',
        recommendations: '',
        standardUnits: '',
        avatarUrl: '',
      })
    }
  }, [open])

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name as string]: value })
  }

  const validateFields = (): boolean => {
    const validName = validateText(formData.name, {
      required: true,
      maxLength: 50,
    }, 'Nombre')

    const validSupplies = formData.supplies.length > 0
    if (!validSupplies) {
      toast.error('Debe seleccionar al menos un insumo.')
    }

    const validSteps = validateText(formData.steps, {
      required: true,
      maxLength: 1000,
    }, 'Procedimiento')

    const validRecommendations = validateText(formData.recommendations, {
      maxLength: 500,
    }, 'Recomendaciones', 'Máximo 500 caracteres permitidos.')

    const validUnits =
      formData.standardUnits === '' ||
      validateGeneralNumber(
        parseInt(formData.standardUnits),
        { required: false, isNegative: false },
        'Estandar de unidades diarias',
      )

    return validName && validSupplies && validSteps && validRecommendations && validUnits
  }

  const handleSave = () => {
    if (validateFields()) {
      onSave(formData)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Crear Receta</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="avatarUrl"
          label="URL de la Imagen"
          type="url"
          fullWidth
          value={formData.avatarUrl}
          onChange={handleChange}
          required
        />
        {formData.avatarUrl && (
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <img
              src={formData.avatarUrl}
              alt="Vista previa"
              style={{ maxWidth: '100%', maxHeight: '150px' }}
            />
          </div>
        )}
        <TextField
          margin="dense"
          name="name"
          label="Nombre"
          type="text"
          fullWidth
          required
          value={formData.name}
          onChange={handleChange}
          inputProps={{ maxLength: 50 }}
          helperText={`${formData.name.length}/50`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
        <FormControl fullWidth>
          <InputLabel id="insumosSelector">Insumos</InputLabel>
          <Select
            required
            labelId="insumosSelector"
            className={classes.select}
            name="supplies"
            multiple
            value={formData.supplies}
            onChange={handleChange}
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
          <FormHelperText>
            Seleccione los insumos necesarios para la receta
          </FormHelperText>
        </FormControl>
        <TextField
          margin="dense"
          name="steps"
          required
          label="Procedimiento"
          type="text"
          multiline
          rows={4}
          fullWidth
          value={formData.steps}
          onChange={handleChange}
          inputProps={{ maxLength: 1000 }}
          helperText={`${formData.steps.length}/1000`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
        <TextField
          margin="dense"
          name="recommendations"
          label="Recomendaciones"
          type="text"
          multiline
          rows={4}
          fullWidth
          value={formData.recommendations}
          onChange={handleChange}
          inputProps={{ maxLength: 500 }}
          helperText={`${formData.recommendations.length}/500`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
        <TextField
          margin="dense"
          name="standardUnits"
          label="Estandar de unidades por día"
          type="number"
          fullWidth
          value={formData.standardUnits}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (value > 0 || e.target.value === '') {
              handleChange(e)
            }
          }}
          inputProps={{
            min: 1,
            step: 1,
          }}
          helperText="Ingrese un número mayor a 0."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RecipeDialogCreate
