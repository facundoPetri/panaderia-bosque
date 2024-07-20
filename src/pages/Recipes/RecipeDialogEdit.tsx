import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { RecipesResponse } from '../../interfaces/Recipes';

interface RecipeDialogProps {
  recipe: RecipesResponse | null;
  onClose: () => void;
  editable?: boolean;
  onSave?: (recipe: RecipesResponse) => void;
}

const RecipeDialogEdit: React.FC<RecipeDialogProps> = ({ recipe, onClose, editable = false, onSave }) => {
  const [editedRecipe, setEditedRecipe] = useState<RecipesResponse | null>(recipe);

  useEffect(() => {
    setEditedRecipe(recipe);
  }, [recipe]);

  if (!recipe) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedRecipe) {
      const { name, value } = event.target;
      setEditedRecipe({ ...editedRecipe, [name]: value });
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedRecipe) {
      const { name, checked } = event.target;
      setEditedRecipe({ ...editedRecipe, [name]: checked });
    }
  };

  const handleSave = () => {
    if (onSave && editedRecipe) {
      onSave(editedRecipe);
    }
  };

  return (
    <Dialog open={!!recipe} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Receta de {recipe.name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Creado por {recipe.author}</Typography>
        <Typography variant="body2">El día {recipe.createdAt}</Typography>
        <Typography variant="body2">{recipe.standardUnits} usos</Typography>
        <FormControlLabel
          control={<Checkbox checked={editedRecipe?.state} name="state" disabled={!editable} onChange={handleCheckboxChange} />}
          label="Activa"
        />
        <TextField
          label="Ingredientes"
          multiline
          rows={4}
          name="ingredients"
          value={editedRecipe?.ingredients || ''}
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
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
        <Typography variant="body2">Modificado el día {recipe.updatedAt}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cerrar</Button>
        {editable && (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RecipeDialogEdit;
