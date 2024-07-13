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

interface Recipe {
  name: string;
  ingredients: string;
  author: string;
  applications: number;
  creationDate: string;
  modificationDate: string;
}

interface RecipeDialogProps {
  open: boolean;
  onClose: () => void;
  recipe: Recipe | null;
}

const RecipeDialogEdit: React.FC<RecipeDialogProps> = ({ open, onClose, recipe }) => {
  if (!recipe) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Receta de {recipe.name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Creado por {recipe.author}</Typography>
        <Typography variant="body2">El día {recipe.creationDate}</Typography>
        <Typography variant="body2">{recipe.applications} usos</Typography>
        <FormControlLabel
          control={<Checkbox checked={true} disabled />}
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
        />
        <TextField
          label="Procedimiento"
          multiline
          rows={4}
          value="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Recomendaciones"
          multiline
          rows={2}
          value="Lorem ipsum"
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Typography variant="body2">Modificado el día {recipe.modificationDate}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Eliminar</Button>
        <Button onClick={onClose} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeDialogEdit;