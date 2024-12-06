import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core'
import { MachinesResponse } from '../../interfaces/Machines'

interface MaintenanceDialogCreateProps {
  open: boolean
  onClose: () => void
  onSave: (machineMaintenance: any) => void
  machines: MachinesResponse[]
}

const MaintenanceDialogCreate: React.FC<MaintenanceDialogCreateProps> = ({
  open,
  onClose,
  onSave,
  machines,
}) => {
  const [machine, setMachine] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const handleSave = () => {
    const newMachineMaintenance = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      date,
      machine,
    }
    onSave(newMachineMaintenance)
    handleClose()
  }

  const handleClose = () => {
    onClose()
    setDescription('')
    setDate('')
    setMachine('')
  }

  const today = new Date()
  const maxDate = today.toISOString().split('T')[0]

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Cargar mantenimiento</DialogTitle>
      <DialogContent>
        <TextField
          id="Maquinaria"
          select
          label="Maquinaria"
          helperText="seleccione una maquinaria"
          value={machine}
          fullWidth
          onChange={(e) => setMachine(e.target.value as string)}
        >
          {machines.map((machine) => (
            <MenuItem key={machine._id} value={machine._id}>
              {machine.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Fecha"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          helperText="Fecha en la que se realizó el mantenimiento"
          inputProps={{
            max: maxDate,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={machine === '' || date === ''}
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MaintenanceDialogCreate
