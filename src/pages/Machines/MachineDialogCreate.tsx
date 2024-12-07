import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core'

interface MachineDialogCreateProps {
  open: boolean
  onClose: () => void
  onSave: (machineMaintenance: any) => void
}

const MachineDialogCreate: React.FC<MachineDialogCreateProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [acquisitionDate, setAcquisitionDate] = useState('')
  const [desiredMaintenanceInterval, setDesiredMaintenanceInterval] =
    useState('')

  const handleSave = () => {
    const newMachineMaintenance = {
      id: Math.random().toString(36).substr(2, 9), // Genera un id aleatorio
      name,
      description,
      purcharse_date: acquisitionDate,
      desired_maintenance: desiredMaintenanceInterval,
      lastMaintenanceDate: '', // Asumimos que es un nuevo registro, por lo que no tiene última fecha de mantenimiento
      priority: 'Media', // Puedes cambiar esto según sea necesario
    }
    onSave(newMachineMaintenance)
    setName('')
    setDescription('')
    setAcquisitionDate('')
    setDesiredMaintenanceInterval('')
  }

  const today = new Date()
  const maxDate = today.toISOString().split('T')[0]

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear una maquinaria nueva</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          type="text"
          required
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Fecha de adquisición"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={acquisitionDate}
          onChange={(e) => setAcquisitionDate(e.target.value)}
          inputProps={{
            max: maxDate,
          }}
        />
        <TextField
          margin="dense"
          label="Mantenimiento deseado"
          type="number"
          fullWidth
          value={desiredMaintenanceInterval}
          onChange={(e) => setDesiredMaintenanceInterval(e.target.value)}
          helperText="Mantenimiento deseado en días"
          inputProps={{
            min: 1,
            max: 365,
            step: 1,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MachineDialogCreate
