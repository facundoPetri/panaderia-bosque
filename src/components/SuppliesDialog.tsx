import React from 'react';
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

interface StockItem {
  name: string;
  lastLoadDate: string;
  currentStock: string;
  description: string;
  usedIn: string;
  packageSize: number;
  unit: string;
  lot1: number;
  lot2: number;
  expirationDate: string;
  minStock: number;
  maxStock: number;
  imageUrl: string;
}

interface StockModalProps {
  open: boolean;
  handleClose: () => void;
  stockItem: StockItem | null;
}

const SuppliesDialog: React.FC<StockModalProps> = ({ open, handleClose, stockItem }) => {
  const classes = useStyles();

  if (!stockItem) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Usado en"
              value={stockItem.usedIn}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tamaño del paquete"
              value={stockItem.packageSize}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Unidad de medida"
              value={stockItem.unit}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuppliesDialog;
