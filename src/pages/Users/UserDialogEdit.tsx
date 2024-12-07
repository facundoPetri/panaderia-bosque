import React, { useEffect, useState } from 'react'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { TransformedUser } from '../../interfaces/Users'
import { toast } from 'react-toastify'
import { validateText } from '../../utils/validateData'

interface UserModalProps {
  user: TransformedUser | null
  onClose: () => void
  editable?: boolean
  onSave?: (user: TransformedUser) => void
}

const UserDialogEdit: React.FC<UserModalProps> = ({
  user,
  onClose,
  editable = false,
  onSave,
}) => {
  const [formData, setFormData] = useState<TransformedUser | null>(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(user)
      setConfirmPassword('')
      setErrors({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        type: '',
      })
      setIsSubmitting(false)
    }
  }, [user])

  const validateForm = (): boolean => {
    if (!formData) return false

    const { fullname, email, password, type } = formData
    let isValid = true
    const newErrors = {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      type: '',
    }

    if (!validateText(fullname, { required: true, maxLength: 30 }, 'Nombre Completo')) {
      newErrors.fullname = 'Nombre Completo no válido.'
      isValid = false
    }

    if (!validateText(email, { required: true, maxLength: 50 }, 'Email')) {
      newErrors.email = 'Email no válido.'
      isValid = false
    }

    if (editable && !validateText(password, { required: true, maxLength: 20 }, 'Contraseña')) {
      newErrors.password = 'Contraseña no válida.'
      isValid = false
    }

    if (editable && confirmPassword !== password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.'
      isValid = false
    }

    if (!type) {
      newErrors.type = 'El tipo de usuario es obligatorio.'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target

    if (name && formData) {
      setFormData({ ...formData, [name]: value as string })

      // Reset errors only if not submitting
      if (!isSubmitting) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }

      if (name === 'confirmPassword') {
        setConfirmPassword(value as string)
        if (!isSubmitting) {
          setErrors((prev) => ({ ...prev, confirmPassword: '' }))
        }
      }
    }
  }

  const handleSave = () => {
    setIsSubmitting(true)
    if (validateForm() && onSave && formData) {
      onSave(formData)
      toast.success('Usuario guardado correctamente.')
    }
  }

  const handleClose = () => {
    setFormData(null)
    onClose()
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    padding: 20,
  }

  return (
    <Modal open={!!user} onClose={handleClose}>
      <Paper style={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar>{user?.image ?? user?.fullname.charAt(0)}</Avatar>
            <Box ml={2}>
              <Typography variant="h6">{user?.fullname}</Typography>
              <Typography variant="subtitle1">{user?.type}</Typography>
              <Typography variant="body2">
                Usuario creado el {user?.createdAt}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </Box>
        <Divider style={{ margin: '20px 0' }} />
        <TextField
          autoFocus
          margin="dense"
          name="fullname"
          label="Nombre Completo"
          type="text"
          fullWidth
          inputProps={{ maxLength: 30 }}
          value={formData?.fullname || ''}
          onChange={handleChange}
          error={!!errors.fullname}
          helperText={errors.fullname}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData?.email || ''}
          margin="dense"
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        {editable && (
          <>
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData?.password || ''}
              margin="dense"
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              inputProps={{ maxLength: 20 }}
            />
            <TextField
              fullWidth
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              margin="dense"
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              inputProps={{ maxLength: 20 }}
            />
          </>
        )}
        <FormControl fullWidth margin="dense">
          <InputLabel>Tipo de usuario</InputLabel>
          <Select
            name="type"
            value={formData?.type || ''}
            onChange={handleChange}
            error={!!errors.type}
          >
            <MenuItem value="user">Empleado</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="master">Maestro Panadero</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClose} color="primary">
            Cerrar
          </Button>
          {editable && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Guardar
            </Button>
          )}
        </Box>
      </Paper>
    </Modal>
  )
}

export default UserDialogEdit
