import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import { OrderResponse } from '../../interfaces/Orders';

interface ProviderOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderResponse | null;
    onSave: (order: OrderResponse) => void;
    onDelete?: (id: string) => void;
}

const ProvidersOrdersDialogView: React.FC<ProviderOrderDialogProps> = ({ isOpen, onClose, order, onSave, onDelete }) => {
    const [acquisitionDate, setAcquisitionDate] = useState<string>(order ? order.date.toString().split('T')[0] : '');

    if (!order) return null;

    const handleSave = () => {
        const updatedOrder = {
            ...order,
            date: new Date(acquisitionDate),
        };
        onSave(updatedOrder);
    };

    const handleDelete = () => {
        if (onDelete) onDelete(order._id);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Pedido n° {order.number}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Fecha del pedido"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: true,
                    }}
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
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
                    value={order.supplies.map(supply => supply.name).join(', ')}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={handleDelete} startIcon={<FontAwesomeIcon icon={faTrash} />}>
                    Eliminar
                </Button>
                <Button variant="contained" color="primary" onClick={handleSave} startIcon={<FontAwesomeIcon icon={faSave} />}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProvidersOrdersDialogView;
