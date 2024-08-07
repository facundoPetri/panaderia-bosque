import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Avatar,
  IconButton,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles({
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    margin: '10px auto',
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: '#BEBEBE',
  },
  inputFile: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00C853',
    color: '#FFFFFF',
    borderRadius: '50%',
    width: 24,
    height: 24,
  },
})

interface UserDialogCreateProps {
  open: boolean
  onClose: () => void
  onSave: (user: any) => void
}

const UserDialogCreate: React.FC<UserDialogCreateProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const classes = useStyles()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
  })
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      // Limpiar el formulario y el avatar al cerrar el diálogo
      setFormData({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        type: '',
      })
      setAvatar(null)
    }
  }, [open])

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name as string]: value })
  }

  const handleSave = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    onSave({ ...formData, avatar })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Crear Usuario</DialogTitle>
      <DialogContent>
        <div className={classes.avatarContainer}>
          <Avatar className={classes.avatar} src={avatar || undefined} />
          <input
            type="file"
            accept="image/*"
            className={classes.inputFile}
            onChange={handleAvatarChange}
          />
          <IconButton className={classes.addIcon}>
            <FontAwesomeIcon icon={faPlus} style={{ width: 16, height: 16 }} />
          </IconButton>
        </div>
        <TextField
          autoFocus
          margin="dense"
          name="fullname"
          label="Nombre Completo"
          type="text"
          fullWidth
          value={formData.fullname}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="password"
          label="Contraseña"
          type="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          fullWidth
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Tipo de usuario</InputLabel>
          <Select name="type" value={formData.type} onChange={handleChange}>
            <MenuItem value="user">Empleado</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="master">Maestro Panadero</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserDialogCreate
