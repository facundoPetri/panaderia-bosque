import React, { useEffect, useState } from 'react';
import {
    Modal,
    Paper,
    Typography,
    Avatar,
    Divider,
    TextField,
    Button,
    IconButton,
    Box,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { User } from './Users';

interface UserModalProps {
    user: User | null;
    onClose: () => void;
    editable?: boolean;
    onSave?: (user: User) => void;
}

const UserDialogEdit: React.FC<UserModalProps> = ({ user, onClose, editable = false, onSave }) => {
    const [editedUser, setEditedUser] = useState<User | null>(user);

    useEffect(() => {
        setEditedUser(user);
    }, [user]);
    
    if (!user) return null;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (editedUser) {
            const { name, value } = event.target;
            
            setEditedUser({ ...editedUser, [name]: value });
        }
    };

    const handleSave = () => {
        if (onSave && editedUser) {
            onSave(editedUser);
        }
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: 'white',
        padding: 20,
    };

    return (
        <Modal open={!!user} onClose={onClose}>
            <Paper style={style}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                        <Avatar>{user.fullName.charAt(0)}</Avatar>
                        <Box ml={2}>
                            <Typography variant="h6">{user.fullName}</Typography>
                            <Typography variant="subtitle1">{user.role}</Typography>
                            <Typography variant="body2">Usuario creado el {user.creationDate}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider style={{ margin: '20px 0' }} />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={editedUser ? editedUser.email : ''}
                    margin="dense"
                    onChange={handleChange}
                    InputProps={{
                        readOnly: !editable,
                    }}
                />
                <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type="password"
                    margin="dense"
                    value={'**********'}
                    InputProps={{
                        readOnly: !editable,
                    }}
                />
                <TextField
                    fullWidth
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    type="password"
                    margin="dense"
                    value={'**********'}
                    InputProps={{
                        readOnly: !editable,
                    }}
                />
                <TextField
                    fullWidth
                    label="Tipo"
                    name="role"
                    value={editedUser ? editedUser.role : ''}
                    margin="dense"
                    onChange={handleChange}
                    InputProps={{
                        readOnly: !editable,
                    }}
                />
                <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button onClick={onClose} color="primary">Cerrar</Button>
                    {editable && (
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Guardar
                        </Button>
                    )}
                </Box>
            </Paper>
        </Modal>
    );
};

export default UserDialogEdit;
