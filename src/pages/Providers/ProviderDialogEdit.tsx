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
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Provider } from './Providers';
import { SuppliesResponse } from '../../interfaces/Supplies';

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
    provider: Provider | null;
    onClose: () => void;
    onSave: (provider: Provider) => void;
    editable?: boolean;
    supplies: SuppliesResponse[]
}

const ProviderDialogEdit: React.FC<ProviderDialogEditProps> = ({
    provider,
    onClose,
    onSave,
    editable = true,
    supplies
}) => {
    const classes = useStyles();
    const [formData, setFormData] = useState<Provider>({
        id: '',
        name: '',
        phone: '',
        email: '',
        supplies: [],
    });

    useEffect(() => {
        if (provider) {
            setFormData(provider);
        }
    }, [provider]);

    const handleChange = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
      ) => {
        if (formData) {
          const { name, value } = event.target
          setFormData({ ...formData, [name as string]: value })
        }
      }

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={!!provider} onClose={onClose}>
            <DialogTitle>
                Proveedor: {formData.name}
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Avatar
                    src={provider?.image || '/path/to/default-image.jpg'} // Imagen del proveedor o una por defecto
                    alt={formData.name}
                    className={classes.avatar}
                />
                <TextField
                    margin="dense"
                    name="name"
                    label="Nombre"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                    InputProps={{
                        readOnly: !editable,
                    }}
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                        readOnly: !editable,
                    }}
                />
                <TextField
                    margin="dense"
                    name="phone"
                    label="Teléfono"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.phone}
                    onChange={handleChange}
                    InputProps={{
                        readOnly: !editable,
                    }}
                />
                <Select
                    className={classes.select}
                    name="supplies"
                    multiple
                    value={formData.supplies}
                    onChange={handleChange}
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
