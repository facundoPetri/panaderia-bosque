import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Batch } from '../../interfaces/Batch'
import { SuppliesResponse } from '../../interfaces/Supplies'
import {
  convertToFullDateString,
  formatISODateString,
} from '../../utils/dateUtils'
interface BatchesEditDialogProps {
  onClose: () => void
  onSave: (batch: Batch) => void
  supplies: SuppliesResponse[]
  editable?: boolean
  selectedBatch: Batch | null
}
const BatchesEditDialog: React.FC<BatchesEditDialogProps> = ({
  onClose,
  onSave,
  supplies,
  selectedBatch,
  editable,
}) => {
  const [editedBatch, setEditedBatch] = useState<Batch | null>(selectedBatch)
  useEffect(() => {
    setEditedBatch(selectedBatch)
  }, [selectedBatch])

  if (!selectedBatch) return null
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (editedBatch) {
      const { name, value } = event.target
      setEditedBatch({ ...editedBatch, [name as string]: value })
    }
  }
  const handleChangeSelect = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (editedBatch) {
      const { name, value } = event.target
      const filteredItems = supplies.find((item) =>
        (value as string[]).includes(item._id)
      )
      setEditedBatch({ ...editedBatch, [name as string]: filteredItems })
    }
  }
  const handleSave = () => {
    if (onSave && editedBatch) {
      onSave(editedBatch)
    }
  }
  return (
    <Dialog open={!!selectedBatch} onClose={onClose}>
      <DialogTitle>Lote de insumo</DialogTitle>
      <DialogContent>
        <TextField
          id="insumo"
          select
          label="Insumo"
          name="supply_id"
          InputProps={{
            readOnly: !editable,
          }}
          value={
            supplies.find(
              (item) => item._id === editedBatch?.supply_id?._id || ''
            )?._id
          }
          fullWidth
          onChange={handleChangeSelect}
        >
          {supplies.map((supply) => (
            <MenuItem key={supply._id} value={supply._id}>
              {supply.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Cantidad"
          type="number"
          name="quantity"
          fullWidth
          value={editedBatch?.quantity}
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <TextField
          margin="dense"
          label="Lote"
          type="number"
          fullWidth
          name="batch_number"
          value={editedBatch?.batch_number}
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <TextField
          margin="dense"
          label="Fila"
          type="number"
          fullWidth
          name="row"
          value={editedBatch?.row}
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <TextField
          margin="dense"
          label="Columna"
          type="number"
          fullWidth
          value={editedBatch?.column}
          name="column"
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <TextField
          margin="dense"
          label="Fecha de ingreso"
          type="date"
          fullWidth
          name="date_of_entry"
          InputLabelProps={{ shrink: true }}
          value={convertToFullDateString(
            formatISODateString(editedBatch?.date_of_entry || '')
          )}
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <TextField
          margin="dense"
          label="Fecha de expiración"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          name="expiration_date"
          value={convertToFullDateString(
            formatISODateString(editedBatch?.expiration_date || '')
          )}
          onChange={handleChange}
          InputProps={{
            readOnly: !editable,
          }}
        />
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
  )
}

export default BatchesEditDialog
