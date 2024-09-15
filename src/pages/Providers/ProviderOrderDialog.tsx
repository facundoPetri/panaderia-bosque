import React, { useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, List, ListItem, ListItemText, IconButton, TextField,
    MenuItem, Select, FormControl, InputLabel
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { OrderResponse } from '../../interfaces/Orders';
import { ProviderResponse } from '../../interfaces/Providers';
import { SuppliesResponse } from '../../interfaces/Supplies';
interface ProviderOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderResponse;
    setOrder: React.Dispatch<React.SetStateAction<OrderResponse>>;
    onSave: (order: OrderResponse) => void;
    providers: ProviderResponse[];
    productsByProvider: { [providerId: string]: SuppliesResponse[] };
}

const ProviderOrderDialog: React.FC<ProviderOrderDialogProps> = ({
    isOpen, onClose, order, setOrder, onSave, providers, productsByProvider
}) => {
    const [selectedProvider, setSelectedProvider] = useState<string | null>(order.provider?._id || null);

    const updateOrderTotal = (supplies: SuppliesResponse[]) => {
        const totalQuantity = supplies.reduce((total, supply) => total + (supply.batches?.reduce((batchTotal, batch) => batchTotal + batch.quantity, 0) || 0), 0);
        setOrder(prevOrder => ({
            ...prevOrder,
            supplies,
            number: totalQuantity,
        }));
    };

    const handleProviderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const providerId = event.target.value as string;
        const provider = providers.find(p => p._id === providerId)!;
        setSelectedProvider(providerId);
        updateOrderTotal([]);
        setOrder(prevOrder => ({
            ...prevOrder,
            provider: provider,
            supplies: [],
        }));
    };

    const handleProductSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedProductIds = event.target.value as string[];
        const selectedProducts = selectedProductIds.map(id =>
            productsByProvider[selectedProvider!].find(product => product._id === id)!
        );

        const newProducts = selectedProducts.filter(product =>
            !order.supplies.some(existingProduct => existingProduct._id === product._id)
        ).map(product => ({ ...product, batches: product.batches?.map(batch => ({ ...batch, quantity: 0 })) || [] }));

        updateOrderTotal([...order.supplies, ...newProducts]);
    };

    const handleQuantityChange = (id: string, batchId: string, newQuantity: number) => {
        const updatedSupplies = order.supplies.map(supply =>
            supply._id === id ? {
                ...supply,
                batches: supply.batches?.map(batch =>
                    batch._id === batchId ? { ...batch, quantity: newQuantity } : batch
                )
            } : supply
        );
        updateOrderTotal(updatedSupplies);
    };

    const handleIncreaseQuantity = (id: string, batchId: string) => {
        const updatedSupplies = order.supplies.map(supply =>
            supply._id === id ? {
                ...supply,
                batches: supply.batches?.map(batch =>
                    batch._id === batchId ? { ...batch, quantity: batch.quantity + 1 } : batch
                )
            } : supply
        );
        updateOrderTotal(updatedSupplies);
    };

    const handleDecreaseQuantity = (id: string, batchId: string) => {
        const updatedSupplies = order.supplies.map(supply =>
            supply._id === id ? {
                ...supply,
                batches: supply.batches?.map(batch =>
                    batch._id === batchId && batch.quantity > 0 ? { ...batch, quantity: batch.quantity - 1 } : batch
                )
            } : supply
        );
        updateOrderTotal(updatedSupplies);
    };

    const handleRemoveFromOrder = (id: string) => {
        const updatedSupplies = order.supplies.filter(supply => supply._id !== id);
        updateOrderTotal(updatedSupplies);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Pedido</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Seleccionar Proveedor</InputLabel>
                    <Select value={selectedProvider || ''} onChange={handleProviderChange}>
                        {providers.map(provider => (
                            <MenuItem key={provider._id} value={provider._id}>
                                {provider.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedProvider && (
                    <>
                        {productsByProvider[selectedProvider]?.length > 0 ? (
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Seleccionar Productos</InputLabel>
                                <Select
                                    multiple
                                    value={order.supplies.map(supply => supply._id)}
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
                        ) : (
                            <InputLabel>No existen productos para este proveedor</InputLabel>
                        )}
                    </>
                )}
                <List>
                    {order.supplies.map(supply => (
                        <ListItem key={supply._id}>
                            <ListItemText primary={supply.name} />
                            {supply.batches && supply.batches.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {supply.batches.map((batch, index) => (
                                        <React.Fragment key={`${batch._id}-${index}`}>
                                            <TextField
                                                type="number"
                                                value={batch.quantity}
                                                onChange={(e) => handleQuantityChange(supply._id, batch._id, parseInt(e.target.value ?? 0))}
                                                inputProps={{ min: 0 }}
                                                style={{ width: '60px', marginRight: '10px' }}
                                            />
                                            <IconButton onClick={() => handleIncreaseQuantity(supply._id, batch._id)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDecreaseQuantity(supply._id, batch._id)}>
                                                <FontAwesomeIcon icon={faMinus} />
                                            </IconButton>
                                        </React.Fragment>
                                    ))}
                                    <IconButton onClick={() => handleRemoveFromOrder(supply._id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </IconButton>
                                </div>
                            )}
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
