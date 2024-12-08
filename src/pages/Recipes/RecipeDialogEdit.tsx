import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  Input,
  MenuItem,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { RecipesResponse } from '../../interfaces/Recipes'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { formatISODateString } from '../../utils/dateUtils'
import { validateGeneralNumber, validateText } from '../../utils/validateData'

const useStyles = makeStyles({
  select: {
    marginTop: '1rem',
  },
  charCounter: {
    textAlign: 'right',
    fontSize: '0.75rem',
    color: '#888',
  },
})

interface RecipeDialogProps {
  recipe: RecipesResponse | null
  onClose: () => void
  editable?: boolean
  onSave?: (recipe: RecipesResponse) => void
  supplies: SuppliesResponse[]
}

const RecipeDialogEdit: React.FC<RecipeDialogProps> = ({
  recipe,
  onClose,
  editable = false,
  onSave,
  supplies,
}) => {
  const classes = useStyles()
  const [editedRecipe, setEditedRecipe] = useState<RecipesResponse | null>(recipe)
  const [charCount, setCharCount] = useState({
    name: 0,
    steps: 0,
    recommendations: 0,
  })

  useEffect(() => {
    if (recipe) {
      setEditedRecipe(recipe)
      setCharCount({
        name: recipe.name.length,
        steps: recipe.steps?.length || 0,
        recommendations: recipe.recommendations?.length || 0,
      })
    }
  }, [recipe])

  if (!recipe) return null

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    if (editedRecipe) {
      const { name, value } = event.target
      const newValue = value as string
      setEditedRecipe({ ...editedRecipe, [name as string]: newValue })

      // Actualizar contador de caracteres
      if (name === 'name' || name === 'steps' || name === 'recommendations') {
        setCharCount({ ...charCount, [name]: newValue.length })
      }
    }
  }

  const validateFields = (editedRecipe:RecipesResponse): boolean => {
    const isNameValid = validateText(editedRecipe.name, {
      required: true,
      maxLength: 50,
    }, 'Nombre')

    const isStepsValid = validateText(editedRecipe.steps || '', {
      required: true,
      maxLength: 1000,
    }, 'Procedimiento')

    const isRecommendationsValid = validateText(editedRecipe.recommendations || '', {
      required: false,
      maxLength: 500,
    }, 'Recomendaciones')

    const isStandardUnitsValid = validateGeneralNumber(
      Number(editedRecipe.standardUnits) || 0,
      { required: false, isNegative: true },
      'Estandar de unidades diarias'
    )

    return isNameValid && isStepsValid && isRecommendationsValid && isStandardUnitsValid
  }

  const handleSave = () => {
    if (!editedRecipe) return

    if (onSave && editedRecipe) {
      onSave(editedRecipe)
    }
  }

  return (
    <Dialog open={!!recipe} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Receta de {recipe.name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Creado por {recipe.author.fullname}</Typography>
        <Typography variant="body2">El día {formatISODateString(recipe.createdAt)}</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={editedRecipe?.state}
              name="state"
              disabled={!editable}
              onChange={(e) => {
                if (editedRecipe) {
                  setEditedRecipe({ ...editedRecipe, state: (e.target.checked) })
                }
              }}
            />
          }
          label="Activa"
        />
        <TextField
          label="Nombre"
          name="name"
          value={editedRecipe?.name || ''}
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <Typography className={classes.charCounter}>
          {charCount.name} / 50
        </Typography>
        <Select
          className={classes.select}
          name="supplies"
          multiple
          value={editedRecipe?.supplies.map((sup) => sup._id)}
          onChange={(e) => {
            if (editedRecipe) {
              const { name, value } = e.target
              const selectedSupplies = supplies.filter((item) =>
                (value as string[]).includes(item._id)
              )
              setEditedRecipe({ ...editedRecipe, [name as string]: selectedSupplies })
            }
          }}
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
        <TextField
          label="Procedimiento"
          multiline
          rows={4}
          name="steps"
          value={editedRecipe?.steps || ''}
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <Typography className={classes.charCounter}>
          {charCount.steps} / 1000
        </Typography>
        <TextField
          label="Recomendaciones"
          multiline
          rows={2}
          name="recommendations"
          value={editedRecipe?.recommendations || ''}
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <Typography className={classes.charCounter}>
          {charCount.recommendations} / 500
        </Typography>
        <Typography variant="body2">
          Modificado el día {formatISODateString(recipe.updatedAt)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cerrar
        </Button>
        {editable && (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default RecipeDialogEdit
