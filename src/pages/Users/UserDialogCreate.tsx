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
} from '@material-ui/core'
import { toast } from 'react-toastify'
import { validateText } from '../../utils/validateData'

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
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
    avatarUrl: '',
  })

  const [charCounts, setCharCounts] = useState({
    fullname: 0,
    email: 0,
    password: 0,
    confirmPassword: 0,
  })

  useEffect(() => {
    if (!open) {
      setFormData({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        type: '',
        avatarUrl: '',
      })
      setCharCounts({
        fullname: 0,
        email: 0,
        password: 0,
        confirmPassword: 0,
      })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target
    if (name) {
      setFormData({ ...formData, [name]: value as string })
      if (name in charCounts) {
        setCharCounts({ ...charCounts, [name]: (value as string).length })
      }
    }
  }

  const validateForm = (): boolean => {
    const { fullname, email, password, confirmPassword, type } = formData

    const isFullnameValid = validateText(fullname, { required: true, maxLength: 50 }, 'Nombre Completo')
    const isEmailValid = validateText(email, { required: true, maxLength: 50 }, 'Email')
    const isPasswordValid = validateText(password, { required: true, maxLength: 12 }, 'Contraseña')
    const isConfirmPasswordValid = validateText(confirmPassword, { required: true, maxLength: 12 }, 'Confirmar Contraseña')

    if (!type) {
      toast.error('El tipo de usuario es obligatorio.')
      return false
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.')
      return false
    }

    return (
      isFullnameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    )
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Crear Usuario</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="avatarUrl"
          label="URL de la Imagen"
          type="url"
          fullWidth
          value={formData.avatarUrl}
          onChange={handleChange}
        />
        {formData.avatarUrl && (
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <img
              src={formData.avatarUrl}
              alt="Vista previa"
              style={{ maxWidth: '100%', maxHeight: '150px' }}
            />
          </div>
        )}
        <TextField
          margin="dense"
          name="fullname"
          label="Nombre Completo"
          type="text"
          fullWidth
          inputProps={{ maxLength: 50 }}
          value={formData.fullname}
          onChange={handleChange}
          required
        />
        <div style={{ textAlign: 'right', fontSize: '0.8em', color: 'gray' }}>
          {charCounts.fullname}/50
        </div>
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          inputProps={{ maxLength: 50 }}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div style={{ textAlign: 'right', fontSize: '0.8em', color: 'gray' }}>
          {charCounts.email}/50
        </div>
        <TextField
          margin="dense"
          name="password"
          label="Contraseña"
          type="password"
          fullWidth
          inputProps={{ maxLength: 12 }}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div style={{ textAlign: 'right', fontSize: '0.8em', color: 'gray' }}>
          {charCounts.password}/12
        </div>
        <TextField
          margin="dense"
          name="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          fullWidth
          inputProps={{ maxLength: 12 }}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <div style={{ textAlign: 'right', fontSize: '0.8em', color: 'gray' }}>
          {charCounts.confirmPassword}/12
        </div>
        <FormControl fullWidth margin="dense" required>
          <InputLabel>Tipo de usuario</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <MenuItem value="user">Empleado</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="master">Maestro Panadero</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
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
