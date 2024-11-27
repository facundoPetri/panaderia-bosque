import React, { useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, List, ListItem, ListItemText, IconButton,
    MenuItem, Select, FormControl, InputLabel, Checkbox, TextField
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProviderResponse } from '../../interfaces/Providers';
import { SuppliesResponse } from '../../interfaces/Supplies';

interface ProviderOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: { provider: ProviderResponse; supplies: { product: string; quantity: number }[] }) => void;
    providers: ProviderResponse[];
    supplies: SuppliesResponse[];
}

const ProviderOrderDialogCreate: React.FC<ProviderOrderDialogProps> = ({
    isOpen, onClose, onSave, providers,
}) => {
    const [selectedProvider, setSelectedProvider] = useState<ProviderResponse | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<{ product: SuppliesResponse; quantity: number }[]>([]);

    const handleProviderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const providerId = event.target.value as string;
        const provider = providers.find(p => p._id === providerId) || null;
        setSelectedProvider(provider);
        setSelectedProducts([]); // Limpiar productos al cambiar proveedor
    };

    const handleProductToggle = (product: SuppliesResponse) => {
        const existingProduct = selectedProducts.find(p => p.product._id === product._id);
        if (existingProduct) {
            // Si ya está seleccionado, lo quitamos
            setSelectedProducts(prev => prev.filter(p => p.product._id !== product._id));
        } else {
            // Si no está seleccionado, lo agregamos con cantidad inicial de 1
            setSelectedProducts(prev => [...prev, { product, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (productId: string, quantity: number) => {
        setSelectedProducts(prev =>
            prev.map(p =>
                p.product._id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
            )
        );
    };

    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts(prev => prev.filter(p => p.product._id !== productId));
    };

    const handleSave = () => {
        if (selectedProvider) {
            const supplies = selectedProducts.map(({ product, quantity }) => ({ product: product._id, quantity }));
            onSave({ provider: selectedProvider, supplies });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Crear Pedido</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Seleccionar Proveedor</InputLabel>
                    <Select
                        value={selectedProvider?._id || ''}
                        onChange={handleProviderChange}
                    >
                        {providers.map(provider => (
                            <MenuItem key={provider._id} value={provider._id}>
                                {provider.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedProvider && (
                    <>
                        <FormControl fullWidth margin="normal">
                            <List style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {selectedProvider.supplies.map(product => (
                                    <ListItem key={product._id} dense>
                                        <Checkbox
                                            checked={selectedProducts.some(p => p.product._id === product._id)}
                                            onChange={() => handleProductToggle(product)}
                                        />
                                        <ListItemText primary={product.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </FormControl>
                        <List>
                            {selectedProducts.map(({ product, quantity }) => (
                                <ListItem key={product._id}>
                                    <ListItemText primary={product.name} />
                                    <TextField
                                        type="number"
                                        label="Cantidad"
                                        value={quantity}
                                        onChange={e => handleQuantityChange(product._id, parseInt(e.target.value, 10) || 1)}
                                        style={{ width: '100px', marginRight: '10px' }}
                                    />
                                    <IconButton onClick={() => handleRemoveProduct(product._id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleSave} color="secondary" disabled={!selectedProvider || selectedProducts.length === 0}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProviderOrderDialogCreate;
