import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, List, ListItem, ListItemText, IconButton, TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    date_create?: string;
    provider?: string;
}

interface ProviderOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orderItems: OrderItem[];
    setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
    onSave: (OrderItem: any) => void
}

const ProviderOrderDialog: React.FC<ProviderOrderDialogProps> = ({ isOpen, onClose, orderItems, setOrderItems, onSave }) => {
    const handleRemoveFromOrder = (id: string) => {
        setOrderItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleIncreaseQuantity = (id: string) => {
        setOrderItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecreaseQuantity = (id: string) => {
        setOrderItems(prevItems =>
            prevItems.map(item =>
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        setOrderItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Pedido</DialogTitle>
            <DialogContent>
                <List>
                    {orderItems.map(item => (
                        <ListItem key={item.id}>
                            <ListItemText primary={item.name} />
                            <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                inputProps={{ min: 1 }} // Evita que se ingrese un número menor que 1
                                style={{ width: '60px', marginRight: '10px' }}
                            />
                            <IconButton onClick={() => handleIncreaseQuantity(item.id)}>
                                <FontAwesomeIcon icon={faPlus} />
                            </IconButton>
                            <IconButton onClick={() => handleDecreaseQuantity(item.id)}>
                                <FontAwesomeIcon icon={faMinus} />
                            </IconButton>
                            <IconButton onClick={() => handleRemoveFromOrder(item.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cerrar
                </Button>
                <Button onClick={onSave} color="secondary">
                    Confirmar Pedido
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProviderOrderDialog;
