import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@material-ui/core'
import React, { useState } from 'react'
import { BatchCreateData } from '../../interfaces/Batch'
import { SuppliesResponse } from '../../interfaces/Supplies'
interface BatchesDialogCreateProps {
  open: boolean
  onClose: () => void
  onSave: (batch: BatchCreateData) => void
  supplies: SuppliesResponse[]
}
const BatchesCreateDialog: React.FC<BatchesDialogCreateProps> = ({
  open,
  onClose,
  onSave,
  supplies,
}) => {
  const [row, setRow] = useState(0)
  const [column, setColumn] = useState(0)
  const [batchNumber, setBatchNumber] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [dateOfEntry, setDateOfEntry] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [supplyId, setSupplyId] = useState('')

  const handleSave = () => {
    const newBatch: BatchCreateData = {
      row,
      column,
      batch_number: batchNumber,
      quantity,
      expiration_date: expirationDate,
      date_of_entry: dateOfEntry,
      supply_id: supplyId,
    }

    onSave(newBatch)
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar lote de insumo</DialogTitle>
      <DialogContent>
        <TextField
          id="insumo"
          select
          label="Insumo"
          value={supplyId}
          fullWidth
          onChange={(e) => setSupplyId(e.target.value as string)}
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
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Lote"
          type="number"
          fullWidth
          value={batchNumber}
          onChange={(e) => setBatchNumber(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Fila"
          type="number"
          fullWidth
          value={row}
          onChange={(e) => setRow(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Columna"
          type="number"
          fullWidth
          value={column}
          onChange={(e) => setColumn(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Fecha de ingreso"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={dateOfEntry}
          onChange={(e) => setDateOfEntry(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Fecha de expiración"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BatchesCreateDialog
