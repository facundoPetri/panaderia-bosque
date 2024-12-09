import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  makeStyles,
} from '@material-ui/core'
import { TransformedMachines } from '../../interfaces/Machines'
import { formatDateStringBack } from '../../utils/dateUtils'
import { validateGeneralNumber, validateText } from '../../utils/validateData'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
  characterCount: {
    textAlign: 'right',
    fontSize: '0.75rem',
    color: '#888',
  },
}))

interface MachineMaintenanceModalProps {
  machineMaintenance: TransformedMachines | null
  onClose: () => void
  editable?: boolean
  onSave?: (machineMaintenance: TransformedMachines) => void
}

const MachineDialogEdit: React.FC<MachineMaintenanceModalProps> = ({
  machineMaintenance,
  onClose,
  editable = false,
  onSave,
}) => {
  const [editedMachineMaintenance, setEditedMachineMaintenance] =
    useState<TransformedMachines | null>(machineMaintenance)
  const classes = useStyles()

  useEffect(() => {
    setEditedMachineMaintenance(machineMaintenance)
  }, [machineMaintenance])

  if (!machineMaintenance) return null

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedMachineMaintenance) {
      const { name, value } = event.target
      setEditedMachineMaintenance({
        ...editedMachineMaintenance,
        [name]: value,
      })
    }
  }

  const isValidateForm = (): boolean => {
    const isNameValid = validateText(editedMachineMaintenance?.name || '', { required: true, maxLength: 50 }, 'Nombre')
    const isDescriptionValid = validateText(editedMachineMaintenance?.description || '', { maxLength: 500 }, 'Descripción')
    const isMaintenanceValid = validateGeneralNumber(
      Number(editedMachineMaintenance?.desired_maintenance || 0),
      { required: true, isNegative: true },
      'Mantenimiento deseado'
    )
    return isNameValid && isDescriptionValid && isMaintenanceValid
  }

  const handleSave = () => {
    if (!isValidateForm()) return

    if (onSave && editedMachineMaintenance) {
      onSave(editedMachineMaintenance)
    }
  }

  return (
    <Dialog
      open={!!machineMaintenance}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{machineMaintenance.name}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={editedMachineMaintenance?.name || ''}
              variant="outlined"
              onChange={handleChange}
              inputProps={{
                maxLength: 50,
                readOnly: !editable,
              }}
              helperText={`${editedMachineMaintenance?.name?.length || 0}/50`}
              FormHelperTextProps={{ className: classes.characterCount }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={editedMachineMaintenance?.description || ''}
              variant="outlined"
              onChange={handleChange}
              inputProps={{
                maxLength: 500,
                readOnly: !editable,
              }}
              helperText={`${editedMachineMaintenance?.description?.length || 0}/500`}
              FormHelperTextProps={{ className: classes.characterCount }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mantenimiento deseado (en días)"
              name="desired_maintenance"
              value={editedMachineMaintenance?.desired_maintenance || ''}
              variant="outlined"
              onChange={handleChange}
              inputProps={{
                min: 1,
                max: 365,
                step: 1,
                readOnly: !editable,
              }}
            />
          </Grid>
          {!editable && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Fecha del último mantenimiento"
                name="last_maintenance_date"
                value={formatDateStringBack(editedMachineMaintenance?.last_maintenance_date || '')}
                variant="outlined"
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: !editable,
                }}
              />
            </Grid>
          )}
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

export default MachineDialogEdit
