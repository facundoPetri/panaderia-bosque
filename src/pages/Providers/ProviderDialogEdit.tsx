import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Avatar,
    IconButton,
    makeStyles,
    MenuItem,
    Input,
    Select,
    InputLabel,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SuppliesResponse } from '../../interfaces/Supplies';
import { ProviderResponse } from '../../interfaces/Providers';
import { validateText } from '../../utils/validateData';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    avatar: {
        width: 56,
        height: 56,
        marginBottom: theme.spacing(2),
    },
    select: {
        marginTop: '1rem',
    },
}));

interface ProviderDialogEditProps {
    provider: ProviderResponse | null;
    onClose: () => void;
    onSave: (provider: ProviderResponse) => void;
    editable?: boolean;
    supplies: SuppliesResponse[];
}

const ProviderDialogEdit: React.FC<ProviderDialogEditProps> = ({
    provider,
    onClose,
    onSave,
    editable = true,
    supplies,
}) => {
    const classes = useStyles();
    const [editedProvider, setEditedProvider] = useState<ProviderResponse | null>(provider);

    useEffect(() => {
        setEditedProvider(provider);
    }, [provider]);

    const handleChange = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        if (editedProvider) {
            const { name, value } = event.target;
            const processedValue =
                name === 'estimated_delivery_time' ? Number(value) : value;
            setEditedProvider({ ...editedProvider, [name as string]: processedValue });
        }
    };

    const handleChangeSelect = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        if (editedProvider) {
            const { name, value } = event.target;
            const filteredItems = supplies.filter((item) =>
                (value as string[]).includes(item._id)
            );
            setEditedProvider({ ...editedProvider, [name as string]: filteredItems });
        }
    };

    const isFormValid = (): boolean => {
        if (!editedProvider) return false;

        const isNameValid = validateText(editedProvider.name, { required: true, maxLength: 50 }, 'Nombre');
        const isEmailValid = validateText(editedProvider.email, { required: true, maxLength: 50 }, 'Email');
        const isPhoneValid = validateText(editedProvider.phone, { required: true, maxLength: 50 }, 'Teléfono');
        const isSuppliesValid =
            editedProvider.supplies?.length > 0 ||
            (toast.error('Debes seleccionar al menos un insumo.'), false);

        return isNameValid && isEmailValid && isPhoneValid && isSuppliesValid;
    };

    const handleSave = () => {
        if (isFormValid() && editedProvider) {
            onSave(editedProvider);
        }
    };

    return (
        <Dialog open={!!provider} onClose={onClose}>
            <DialogTitle>
                Proveedor: {provider?.name}
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Avatar
                    src={provider?.image || '/path/to/default-image.jpg'} // Imagen del proveedor o una por defecto
                    alt={provider?.name}
                    className={classes.avatar}
                />
                <TextField
                    margin="dense"
                    name="name"
                    label="Nombre"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={editedProvider?.name}
                    onChange={handleChange}
                    InputProps={{
                        readOnly: !editable,
                    }}
                    helperText={`${editedProvider?.name?.length || 0}/50`}
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={editedProvider?.email}
                    onChange={handleChange}
                    InputProps={{
                        readOnly: !editable,
                    }}
                    helperText={`${editedProvider?.email?.length || 0}/50`}
                />
                <TextField
                    margin="dense"
                    name="phone"
                    label="Teléfono"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={editedProvider?.phone}
                    onChange={handleChange}
                    InputProps={{
                        readOnly: !editable,
                    }}
                    helperText={`${editedProvider?.phone?.length || 0}/50`}
                />
                <TextField
                    margin="dense"
                    name="estimated_delivery_time"
                    label="Tiempo de entrega"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={editedProvider?.estimated_delivery_time}
                    helperText="Tiempo estimado de entrega de mercaderia en días"
                    onChange={handleChange}
                    InputProps={{
                        readOnly: !editable,
                    }}
                    inputProps={{
                        min: 1,
                        step: 1,
                    }}
                />
                <InputLabel id="insumosSelector">Insumos</InputLabel>
                <Select
                    labelId="insumosSelector"
                    className={classes.select}
                    name="supplies"
                    multiple
                    value={editedProvider?.supplies?.map((sup) => sup._id) || []}
                    onChange={(e) => handleChangeSelect(e)}
                    label="Insumos"
                    input={<Input />}
                    fullWidth
                >
                    {supplies.map((sup) => (
                        <MenuItem key={sup._id} value={sup._id}>
                            {sup.name}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cerrar
                </Button>
                {editable && (
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Guardar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ProviderDialogEdit;
