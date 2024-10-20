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
import {
  convertToDisplayDateString,
  convertToFullDateString,
} from '../../utils/dateUtils'
import { TransformedMaintenance } from '../../interfaces/Maintenance'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
}))

interface MachinesMaintenanceDialogProps {
  selectedMaintenance: TransformedMaintenance | null
  onClose: () => void
  editable?: boolean
  onSave?: (machineMaintenance: TransformedMaintenance) => void
}

const MachinesMaintenanceDialog: React.FC<MachinesMaintenanceDialogProps> = ({
  selectedMaintenance,
  onClose,
  editable = false,
  onSave,
}) => {
  const [editedMachineMaintenance, setEditedMachineMaintenance] =
    useState<TransformedMaintenance | null>(selectedMaintenance)
  const classes = useStyles()

  useEffect(() => {
    setEditedMachineMaintenance(selectedMaintenance)
  }, [selectedMaintenance])

  if (!selectedMaintenance) return null

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedMachineMaintenance) {
      const { name, value } = event.target
      if (name === 'date') {
        setEditedMachineMaintenance({
          ...editedMachineMaintenance,
          [name]: convertToDisplayDateString(value),
        })
      } else {
        setEditedMachineMaintenance({
          ...editedMachineMaintenance,
          [name]: value,
        })
      }
    }
  }

  const handleSave = () => {
    if (onSave && editedMachineMaintenance) {
      onSave(editedMachineMaintenance)
    }
  }

  return (
    <Dialog
      open={!!selectedMaintenance}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{selectedMaintenance.machine}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Fecha del mantenimiento"
              name="date"
              value={convertToFullDateString(
                editedMachineMaintenance?.date || ''
              )}
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Usuario"
              name="user"
              value={editedMachineMaintenance?.user || ''}
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripcion"
              name="description"
              value={editedMachineMaintenance?.description || ''}
              variant="outlined"
              onChange={handleChange}
              multiline
              rows={3}
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

export default MachinesMaintenanceDialog
