import React from 'react';
import { OrderResponse } from '../../interfaces/Orders';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';

interface OrderDetailsModalProps {
  order: OrderResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: OrderResponse) => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose, onSave }) => {
  const handleSave = () => {
    if (order) {
      onSave(order);
    }
  };

  if (!order) {
    return null; // Don't render the dialog if order is null
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{`Pedido n° ${order.number}`}</DialogTitle>
      <DialogContent>
        <TextField
          label="Fecha del pedido"
          value={new Date(order.date).toLocaleDateString()} // Muestra la fecha en formato legible
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Proveedor que entrega"
          value={order.provider.name}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Insumos en el pedido"
          value={order.supplies.map(supply => supply.name).join(', ')} // Convierte la lista de insumos en un string
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          CERRAR
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          GUARDAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
