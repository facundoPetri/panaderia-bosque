import React from 'react';
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

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
}));

interface MachineMaintenance {
  name: string;
  user: string;
  acquisitionDate: string;
  lastMaintenanceDate: string;
  desiredMaintenanceInterval: string;
  priority: string;
}

interface MachineMaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  machineMaintenance: MachineMaintenance | null;
}

const MachineMaintenanceDialogEdit: React.FC<MachineMaintenanceModalProps> = ({ open, onClose, machineMaintenance }) => {
  const classes = useStyles();

  if (!machineMaintenance) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{machineMaintenance.name}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mantenimiento deseado (en días)"
              value={machineMaintenance.desiredMaintenanceInterval}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Usuario"
              value={machineMaintenance.user}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Fecha del último mantenimiento"
              value={machineMaintenance.lastMaintenanceDate}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button onClick={onClose} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MachineMaintenanceDialogEdit;