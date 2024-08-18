import React, { useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, List, ListItem, ListItemText, IconButton, TextField,
    MenuItem, Select, FormControl, InputLabel
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { SuppliesResponse } from '../../interfaces/Supplies';

export interface Item {
    id: string;
    name: string;
    quantity: number;
}

export interface OrderItem {
    items: Item[];
    date_create: string;
    provider: string;
}

interface ProviderOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderItem;
    setOrder: React.Dispatch<React.SetStateAction<OrderItem>>;
    onSave: (order: OrderItem) => void;
    providers: string[];
    productsByProvider: { [provider: string]: SuppliesResponse[] };
}

const ProviderOrderDialog: React.FC<ProviderOrderDialogProps> = ({
    isOpen, onClose, order, setOrder, onSave, providers, productsByProvider
}) => {
    const [selectedProvider, setSelectedProvider] = useState<string | null>(order.provider || null);

    const handleProviderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const provider = event.target.value as string;
        setSelectedProvider(provider);
        setOrder({
            items: [],
            date_create: new Date().toISOString().split('T')[0], // Fecha actual
            provider: provider,
        });
    };

    const handleProductSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedProductIds = event.target.value as string[];
        const selectedProducts = selectedProductIds.map(id =>
            productsByProvider[selectedProvider!].find(product => product._id === id)!
        );
        setOrder(prevOrder => ({
            ...prevOrder,
            items: selectedProducts.map(product => ({
                id: product._id,
                name: product.name,
                quantity: 0, // Inicialmente en 0, se puede cambiar después
            })),
        }));
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            items: prevOrder.items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        }));
    };

    const handleRemoveFromOrder = (id: string) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            items: prevOrder.items.filter(item => item.id !== id)
        }));
    };

    const handleIncreaseQuantity = (id: string) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            items: prevOrder.items.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        }));
    };

    const handleDecreaseQuantity = (id: string) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            items: prevOrder.items.map(item =>
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        }));
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Pedido</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Seleccionar Proveedor</InputLabel>
                    <Select value={selectedProvider || ''} onChange={handleProviderChange}>
                        {providers.map(provider => (
                            <MenuItem key={provider} value={provider}>
                                {provider}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedProvider && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Seleccionar Productos</InputLabel>
                        <Select
                            multiple
                            value={order.items.map(item => item.id)}
                            onChange={handleProductSelect}
                            renderValue={(selected) =>
                                (selected as string[]).map((id: string) =>
                                    productsByProvider[selectedProvider].find(p => p._id === id)?.name
                                ).join(', ')
                            }
                        >
                            {productsByProvider[selectedProvider].map(product => (
                                <MenuItem key={product._id} value={product._id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <List>
                    {order.items.map(item => (
                        <ListItem key={item.id}>
                            <ListItemText primary={item.name} />
                            <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                inputProps={{ min: 0 }}
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
                <Button onClick={() => onSave(order)} color="secondary">
                    Confirmar Pedido
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProviderOrderDialog;
