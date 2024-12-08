import React, { useState } from "react";
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
} from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { RecipesResponse } from "../../interfaces/Recipes";
import { validateDate, validateSpecificNumber, validateText } from "../../utils/validateData";

interface ProductionEfficienciesDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => void;
  recipes: RecipesResponse[];
}

const useStyles = makeStyles(() => ({
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  characterCount: {
    textAlign: "right",
    fontSize: "0.75rem",
    color: "gray",
  },
}));

const ProductionEfficienciesDialog: React.FC<ProductionEfficienciesDialogProps> = ({
  open,
  onClose,
  onSave,
  recipes,
}) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    observations: "",
    unitsMade: "",
    equipmentUsed: "",
    selectedRecipeId: recipes[0]?._id || "",
  });

  const selectedRecipe = recipes.find((recipe) => recipe._id === formData.selectedRecipeId);

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const isDateValid = validateDate(formData.startDate, formData.endDate);
    const isObservations = validateText(formData.observations, { maxLength: 500 }, "Comentarios y observaciones");
    const isUnitsMade = validateSpecificNumber(Number(formData.unitsMade), { min: 1 }, "Cantidad de unidades fabricadas");
    const isEquipmentUsed = validateText(formData.equipmentUsed, { required: true, maxLength: 200 }, "Equipamiento utilizado");

    return isDateValid && isObservations && isUnitsMade && isEquipmentUsed;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Informe de Receta</h3>
        <FontAwesomeIcon icon={faTimes} onClick={onClose} style={{ cursor: "pointer" }} />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="recipe-select-label">Receta</InputLabel>
              <Select
                labelId="recipe-select-label"
                value={formData.selectedRecipeId}
                onChange={(e) => handleFieldChange("selectedRecipeId", e.target.value as string)}
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
                value={formData.startDate}
                onChange={(date) => handleFieldChange("startDate", date!)}
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
                value={formData.endDate}
                onChange={(date) => handleFieldChange("endDate", date!)}
                fullWidth
                inputVariant="outlined"
                margin="normal"
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Ingredientes
            </Typography>
            <Typography variant="body2" color="textPrimary">
              {selectedRecipe?.supplies
                ?.flatMap((supply) => supply.name.split(","))
                .map((ingredient) => ingredient.trim())
                .join(", ") || "No hay ingredientes para mostrar."}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Comentarios y observaciones"
              value={formData.observations}
              onChange={(e) => handleFieldChange("observations", e.target.value)}
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
              value={formData.unitsMade}
              onChange={(e) => handleFieldChange("unitsMade", e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Equipamiento utilizado"
              value={formData.equipmentUsed}
              onChange={(e) => handleFieldChange("equipmentUsed", e.target.value)}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              margin="normal"
            />
            <FormHelperText className={classes.characterCount}>
              {`${formData.equipmentUsed.length}/200`}
            </FormHelperText>
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
  );
};

export default ProductionEfficienciesDialog;
