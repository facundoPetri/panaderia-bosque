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
import { Recipe } from './Recipes';

interface RecipeDialogProps {
  recipe: Recipe | null;
  onClose: () => void;
  editable?: boolean;
  onSave?: (recipe: Recipe) => void;
}

const RecipeDialogEdit: React.FC<RecipeDialogProps> = ({ recipe, onClose, editable = false, onSave }) => {
  

  const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(recipe);

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
        <Typography variant="body2">El día {recipe.creationDate}</Typography>
        <Typography variant="body2">{recipe.applications} usos</Typography>
        <FormControlLabel
          control={<Checkbox checked={true} disabled={editable} onChange={handleChange}/>}
          label="Activa"
        />
        <TextField
          label="Ingredientes"
          multiline
          rows={4}
          value="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
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
          value="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
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
          value="Lorem ipsum"
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
        }}
        />
        <Typography variant="body2">Modificado el día {recipe.modificationDate}</Typography>
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