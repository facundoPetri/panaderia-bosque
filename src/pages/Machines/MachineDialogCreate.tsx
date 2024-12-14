import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  makeStyles,
} from '@material-ui/core'
import { toast } from 'react-toastify'
import { validateGeneralNumber, validateText } from '../../utils/validateData'

const useStyles = makeStyles({
  characterCount: {
    textAlign: 'right',
    fontSize: '0.75rem',
    color: '#888',
  },
})

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
  const classes = useStyles()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [acquisitionDate, setAcquisitionDate] = useState('')
  const [desiredMaintenanceInterval, setDesiredMaintenanceInterval] = useState('')

  const isFormValid = (): boolean => {
    const isNameValid = validateText(name, { required: true, maxLength: 50 }, 'Nombre')
    const isDescriptionValid = validateText(description, { maxLength: 500 }, 'Descripción')
    const isAcquisitionDateValid = acquisitionDate.trim() !== ''
      ? true
      : (toast.error('La fecha de adquisición es obligatoria.'), false)
    const isMaintenanceValid = validateGeneralNumber(
      Number(desiredMaintenanceInterval),
      { required: true, isNegative: true },
      'Mantenimiento deseado'
    )

    return isNameValid && isDescriptionValid && isAcquisitionDateValid && isMaintenanceValid
  }

  const handleSave = () => {
    if (!isFormValid()) return

    const newMachineMaintenance = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      purcharse_date: acquisitionDate,
      desired_maintenance: Number(desiredMaintenanceInterval),
      lastMaintenanceDate: '',
      priority: 'Media',
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
          inputProps={{ maxLength: 50 }}
          onChange={(e) => setName(e.target.value)}
          helperText={`${name.length}/50`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          value={description}
          inputProps={{ maxLength: 500 }}
          onChange={(e) => setDescription(e.target.value)}
          helperText={`${description.length}/500`}
          FormHelperTextProps={{ className: classes.characterCount }}
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
          helperText="Mantenimiento deseado en días (mínimo 1 día)"
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
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MachineDialogCreate
