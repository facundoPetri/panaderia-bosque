import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  makeStyles
} from '@material-ui/core';
import { TransformedMachines } from '../../interfaces/Machines';

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
}));

interface MachineMaintenanceModalProps {
  machineMaintenance: TransformedMachines | null;
  onClose: () => void;
  editable?: boolean;
  onSave?: (machineMaintenance: TransformedMachines) => void;
}

const MachineMaintenanceDialogEdit: React.FC<MachineMaintenanceModalProps> = ({ machineMaintenance, onClose, editable = false, onSave }) => {
  const [editedMachineMaintenance, setEditedMachineMaintenance] = useState<TransformedMachines | null>(machineMaintenance);
  const classes = useStyles();

  useEffect(() => {
    setEditedMachineMaintenance(machineMaintenance);
  }, [machineMaintenance]);

  if (!machineMaintenance) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editedMachineMaintenance) {
      const { name, value } = event.target;
      setEditedMachineMaintenance({ ...editedMachineMaintenance, [name]: value });
    }
  };

  const handleSave = () => {
    if (onSave && editedMachineMaintenance) {
      onSave(editedMachineMaintenance);
    }
  };

  return (
    <Dialog open={!!machineMaintenance} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{machineMaintenance.name}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mantenimiento deseado (en días)"
              name="desired_maintenance"
              value={editedMachineMaintenance?.desired_maintenance || ''}
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Usuario"
              name="user_name"
              value={editedMachineMaintenance?.user_name || ''}
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                readOnly: !editable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Fecha del último mantenimiento"
              name="last_maintenance_date"
              value={editedMachineMaintenance?.last_maintenance_date || ''}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cerrar</Button>
        {editable && (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MachineMaintenanceDialogEdit;
