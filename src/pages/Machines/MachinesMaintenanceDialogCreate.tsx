import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';

interface MachineMaintenanceDialogCreateProps {
  open: boolean;
  onClose: () => void;
  onSave: (machineMaintenance: any) => void;
}

const MachineMaintenanceDialogCreate: React.FC<MachineMaintenanceDialogCreateProps> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [desiredMaintenanceInterval, setDesiredMaintenanceInterval] = useState('');

  const handleSave = () => {
    const newMachineMaintenance = {
      id: Math.random().toString(36).substr(2, 9), // Genera un id aleatorio
      name,
      description,
      acquisitionDate,
      desiredMaintenanceInterval,
      lastMaintenanceDate: '', // Asumimos que es un nuevo registro, por lo que no tiene última fecha de mantenimiento
      priority: 'Media', // Puedes cambiar esto según sea necesario
    };
    onSave(newMachineMaintenance);
    setName('');
    setDescription('');
    setAcquisitionDate('');
    setDesiredMaintenanceInterval('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear un registro de la maquinaria</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          type="text"
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
          InputLabelProps={{ shrink: true }}
          value={acquisitionDate}
          onChange={(e) => setAcquisitionDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Mantenimiento deseado"
          type="text"
          fullWidth
          value={desiredMaintenanceInterval}
          onChange={(e) => setDesiredMaintenanceInterval(e.target.value)}
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
  );
};

export default MachineMaintenanceDialogCreate;
