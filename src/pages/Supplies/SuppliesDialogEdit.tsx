import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import { StockItem } from './Supplies';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: 120,
  },
  productImage: {
    maxWidth: '100%',
    maxHeight: '150px',
    marginBottom: theme.spacing(2),
  },
}));

interface StockModalProps {
  stockItem: StockItem | null;
  onClose: () => void;
  editable?: boolean;
  onSave?: (user: StockItem) => void;
}

const SuppliesDialogEdit: React.FC<StockModalProps> = ({ stockItem, onClose, editable = false, onSave }) => {
  const [editedStockItem, setEditedStockItem] = useState<StockItem | null>(stockItem);
  const classes = useStyles();

    useEffect(() => {
        setEditedStockItem(stockItem);
    }, [stockItem]);
    
    if (!stockItem) return null;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (editedStockItem) {
            const { name, value } = event.target;
            
            setEditedStockItem({ ...editedStockItem, [name]: value });
        }
    };

    const handleSave = () => {
        if (onSave && editedStockItem) {
            onSave(editedStockItem);
        }
    };

  return (
    <Dialog open={!!stockItem} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{stockItem.name}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <img src={stockItem.imageUrl} alt={stockItem.name} className={classes.productImage} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Stock actual: {stockItem.currentStock}</Typography>
            <Typography variant="subtitle1">Stock mínimo: {stockItem.minStock} kg</Typography>
            <Typography variant="subtitle1">Stock máximo: {stockItem.maxStock} kg</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Lote 1: {stockItem.lot1} kg</Typography>
            <Typography variant="subtitle1">Lote 2: {stockItem.lot2} kg</Typography>
            <Typography variant="subtitle1">Próximo lote a vencer: {stockItem.expirationDate}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              value={stockItem.description}
              variant="outlined"
              multiline
              rows={3}
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Usado en"
              value={stockItem.usedIn}
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tamaño del paquete"
              value={stockItem.packageSize}
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Unidad de medida"
              value={stockItem.unit}
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cerrar</Button>
        {editable && (
            <Button variant="contained" color="primary" onClick={handleSave}>
                Guardar
            </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SuppliesDialogEdit;
