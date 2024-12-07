import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SuppliesCreateData } from '../../interfaces/Supplies';
import { validateGeneralNumber, validateSpecificNumber, validateText } from '../../utils/validateData';

const useStyles = makeStyles((theme) => ({
  characterCount: {
    textAlign: 'right',
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
  imagePreview: {
    width: '100%',
    height: '150px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#999',
    marginBottom: theme.spacing(2),
    overflow: 'hidden',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
  },
}));

interface SuppliesDialogCreateProps {
  open: boolean;
  onClose: () => void;
  onSave: (supplies: SuppliesCreateData) => void;
}

const SuppliesDialogCreate: React.FC<SuppliesDialogCreateProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const classes = useStyles();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minStock, setMinStock] = useState<number | string>('');
  const [maxStock, setMaxStock] = useState<number | string>('');
  const [packageSize, setPackageSize] = useState('');
  const [unit, setUnit] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const validateForm = (): boolean => {
    const isImageUrlValid = validateText(imageUrl, { required: true }, 'URL de la imagen');
    const isNameValid = validateText(name, { required: true, maxLength: 20 }, 'Nombre');
    const isDescriptionValid = validateText(description, { required: true, maxLength: 50 }, 'Descripción');
    const isMinStockValid = validateGeneralNumber(Number(minStock), { required: true }, 'Stock mínimo');
    const isMaxStockValid = validateGeneralNumber(Number(maxStock), { required: true }, 'Stock máximo');
    const isMinStockRangeValid = validateSpecificNumber(
      Number(minStock),
      { min: 1, max: Number(maxStock) },
      'Stock mínimo'
    );
    const isMaxStockRangeValid = validateSpecificNumber(Number(maxStock), { min: 1 }, 'Stock máximo');
    const isPackageSizeValid = validateText(packageSize, { required: true, maxLength: 10 }, 'Tamaño del paquete');
    const isUnitValid = validateText(unit, { required: true, maxLength: 10 }, 'Unidad de medida');

    return (
      isImageUrlValid &&
      isNameValid &&
      isDescriptionValid &&
      isMinStockValid &&
      isMaxStockValid &&
      isMinStockRangeValid &&
      isMaxStockRangeValid &&
      isPackageSizeValid &&
      isUnitValid
    );
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Guardar datos si la validación fue exitosa
    const newSupplies: SuppliesCreateData = {
      name,
      updatedAt: new Date().toLocaleDateString(),
      createdAt: new Date().toLocaleDateString(),
      description,
      size: Number(packageSize),
      unit,
      min_stock: Number(minStock),
      max_stock: Number(maxStock),
      image: imageUrl,
    };

    onSave(newSupplies);
    resetFields();
  };


  const resetFields = () => {
    setName('');
    setDescription('');
    setMinStock('');
    setMaxStock('');
    setPackageSize('');
    setUnit('');
    setImageUrl('');
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear un nuevo insumo</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Insertar URL de imagen"
          type="url"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {imageUrl && (
          <div className={classes.imagePreview}>
            <img src={imageUrl} alt="Vista previa" className={classes.image} />
          </div>
        )}
        <TextField
          margin="dense"
          label="Nombre"
          type="text"
          required
          fullWidth
          value={name}
          inputProps={{ maxLength: 20 }}
          onChange={(e) => setName(e.target.value)}
          helperText={`${name.length}/20`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={description}
          inputProps={{ maxLength: 50 }}
          onChange={(e) => setDescription(e.target.value)}
          helperText={`${description.length}/50`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
        <TextField
          margin="dense"
          label="Stock mínimo"
          type="number"
          fullWidth
          value={minStock}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (value > 0 || e.target.value === '') {
              setMinStock(value)
            }
          }}
          inputProps={{
            min: 1,
            step: 1,
          }}
          helperText="Stock mínimo recomendado"
        />
        <TextField
          margin="dense"
          label="Stock máximo"
          type="number"
          fullWidth
          value={maxStock}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (value > 0 || e.target.value === '') {
              setMaxStock(value)
            }
          }}
          inputProps={{
            min: 1,
            step: 1,
          }}
          helperText="Stock máximo permitido en almacén"
        />
        <TextField
          margin="dense"
          label="Tamaño del paquete"
          type="number"
          required
          fullWidth
          value={packageSize}
          onChange={(e) => setPackageSize(e.target.value)}
          inputProps={{
            min: 1,
            step: 1,
          }}
        />
        <TextField
          margin="dense"
          label="Unidad de medida"
          type="text"
          required
          fullWidth
          value={unit}
          inputProps={{ maxLength: 10 }}
          onChange={(e) => setUnit(e.target.value)}
          helperText={`${unit.length}/10`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuppliesDialogCreate;
