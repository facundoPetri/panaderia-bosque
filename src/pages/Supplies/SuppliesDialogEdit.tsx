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
import {
  validateText,
  validateGeneralNumber,
  validateSpecificNumber,
} from '../../utils/validateData'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
  characterCount: {
    textAlign: 'right',
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
}))

interface StockModalProps {
  selectedSupplies: SuppliesResponse | null
  onClose: () => void
  editable?: boolean
  onSave?: (supplies: SuppliesResponse) => void
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

  const validateForm = (): boolean => {
    if (!editedStockItem) return false

    const { name, description, size, unit, max_stock } = editedStockItem

    // Validaciones para texto
    const isNameValid = validateText(
      name || '',
      { required: true, maxLength: 20 },
      'Nombre'
    )
    const isDescriptionValid = validateText(
      description || '',
      { required: true, maxLength: 50 },
      'Descripción'
    )
    const isUnitValid = validateText(
      unit || '',
      { required: true, maxLength: 10 },
      'Unidad de medida'
    )

    // Validaciones para números
    const isSizeValid = validateGeneralNumber(
      Number(size),
      { required: true },
      'Tamaño del paquete'
    )
    const isStockValid = validateSpecificNumber(
      Number(size),
      { max: max_stock },
      'Tamaño del paquete'
    )

    return (
      isNameValid &&
      isDescriptionValid &&
      isUnitValid &&
      isSizeValid &&
      isStockValid
    )
  }

  const handleSave = () => {
    if (onSave && validateForm() && editedStockItem) {
      onSave(editedStockItem)
    }
  }

  return (
    <Dialog open={!!selectedSupplies} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editable ? "Editar " : ""}Insumo</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          {/* Información de stock */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Stock actual:</strong> {selectedSupplies?.current_stock}{' '}
              {selectedSupplies?.unit}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Stock mínimo:</strong> {selectedSupplies?.min_stock}{' '}
              {selectedSupplies?.unit}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Stock máximo:</strong> {selectedSupplies?.max_stock}{' '}
              {selectedSupplies?.unit}
            </Typography>
          </Grid>

          {/* Campos de edición */}
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Nombre"
              type="text"
              fullWidth
              name="name"
              value={editedStockItem?.name || ''}
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
              inputProps={{ maxLength: 20 }}
              helperText={`${editedStockItem?.name?.length || 0}/20`}
              FormHelperTextProps={{ className: classes.characterCount }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Descripción"
              type="text"
              fullWidth
              multiline
              rows={3}
              name="description"
              value={editedStockItem?.description || ''}
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
              inputProps={{ maxLength: 50 }}
              helperText={`${editedStockItem?.description?.length || 0}/50`}
              FormHelperTextProps={{ className: classes.characterCount }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Stock mínimo"
              type="number"
              fullWidth
              name="min_stock"
              value={editedStockItem?.min_stock}
              onChange={handleChange}
              inputProps={{
                min: 1,
                step: 1,
              }}
              helperText="Stock mínimo recomendado"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Stock máximo"
              type="number"
              fullWidth
              name="max_stock"
              value={editedStockItem?.max_stock}
              onChange={handleChange}
              inputProps={{
                min: 1,
                step: 1,
              }}
              helperText="Stock máximo permitido en almacén"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Tamaño del paquete"
              type="number"
              fullWidth
              name="size"
              value={editedStockItem?.size || ''}
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
              helperText="Debe ser un número positivo"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Unidad de medida"
              type="text"
              fullWidth
              name="unit"
              value={editedStockItem?.unit || ''}
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
              inputProps={{ maxLength: 10 }}
              helperText={`${editedStockItem?.unit?.length || 0}/10`}
              FormHelperTextProps={{ className: classes.characterCount }}
            />
          </Grid>
        </Grid>
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

export default SuppliesDialogEdit
