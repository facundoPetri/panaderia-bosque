import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core'
import { SuppliesResponse } from '../../interfaces/Supplies'

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
}))

interface StockModalProps {
  selectedSupplies: SuppliesResponse | null
  onClose: () => void
  editable?: boolean
  onSave?: (user: any) => void
}

const SuppliesDialogEdit: React.FC<StockModalProps> = ({
  selectedSupplies,
  onClose,
  editable = false,
  onSave,
}) => {
  const [editedStockItem, setEditedStockItem] =
    useState<SuppliesResponse | null>(null)
  const classes = useStyles()

  useEffect(() => {
    setEditedStockItem(selectedSupplies)
  }, [selectedSupplies])

  if (!selectedSupplies) return null

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedStockItem) {
      const { name, value } = event.target

      setEditedStockItem({ ...editedStockItem, [name]: value })
    }
  }

  const handleSave = () => {
    if (onSave && editedStockItem) {
      onSave(editedStockItem)
    }
  }

  return (
    <Dialog open={!!selectedSupplies} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{selectedSupplies.name}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            {/* <img
              src={selectedSupplies.imageUrl}
              alt={selectedSupplies.name}
              className={classes.productImage}
            /> */}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              Stock actual: 0 {selectedSupplies.unit}
            </Typography>
            <Typography variant="subtitle1">
              Stock mínimo: {selectedSupplies.min_stock} {selectedSupplies.unit}
            </Typography>
            <Typography variant="subtitle1">
              Stock máximo: {selectedSupplies.max_stock} {selectedSupplies.unit}
            </Typography>
          </Grid>
          {/* <Grid item xs={6}>
            <Typography variant="subtitle1">
              Lote 1: {selectedSupplies.lot1} kg
            </Typography>
            <Typography variant="subtitle1">
              Lote 2: {selectedSupplies.lot2} kg
            </Typography>
            <Typography variant="subtitle1">
              Próximo lote a vencer: {selectedSupplies.expirationDate}
            </Typography>
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="Descripción"
              value={selectedSupplies.description}
              variant="outlined"
              multiline
              rows={3}
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              fullWidth
              label="Usado en"
              value={selectedSupplies.usedIn}
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
            />
          </Grid> */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tamaño del paquete"
              value={selectedSupplies.size}
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
              value={selectedSupplies.unit}
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
        <Button onClick={onClose} color="primary">
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

export default SuppliesDialogEdit
