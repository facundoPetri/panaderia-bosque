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

const useStyles = makeStyles({
  select: {
    marginTop: '1rem',
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
  const [editedRecipe, setEditedRecipe] = useState<RecipesResponse | null>(
    recipe
  )

  useEffect(() => {
    setEditedRecipe(recipe)
  }, [recipe])

  if (!recipe) return null

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (editedRecipe) {
      const { name, value } = event.target
      setEditedRecipe({ ...editedRecipe, [name as string]: value })
    }
  }
  const handleChangeSelect = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (editedRecipe) {
      const { name, value } = event.target
      const filteredItems = supplies.filter((item) =>
        (value as string[]).includes(item._id)
      )
      setEditedRecipe({ ...editedRecipe, [name as string]: filteredItems })
    }
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedRecipe) {
      const { name, checked } = event.target
      setEditedRecipe({ ...editedRecipe, [name]: checked })
    }
  }

  const handleSave = () => {
    if (onSave && editedRecipe) {
      onSave(editedRecipe)
    }
  }

  return (
    <Dialog open={!!recipe} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Receta de {recipe.name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          Creado por {recipe.author.fullname}
        </Typography>
        <Typography variant="body2">El día {formatISODateString(recipe.createdAt)}</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={editedRecipe?.state}
              name="state"
              disabled={!editable}
              onChange={handleCheckboxChange}
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
        <Select
          className={classes.select}
          name="supplies"
          multiple
          value={editedRecipe?.supplies.map((sup) => sup._id)}
          onChange={(e) => handleChangeSelect(e)}
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
