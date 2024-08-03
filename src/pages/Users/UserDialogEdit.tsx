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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { TransformedUser } from '../../interfaces/Users'

interface UserModalProps {
  user: TransformedUser | null
  onClose: () => void
  editable?: boolean
  onSave?: (user: TransformedUser) => void
}

const isEmailUnique = async (email: string): Promise<boolean> => {
  // Simula una llamada a la API que verifica si el email es único
  const existingEmails = ['existing@example.com', 'user@example.com'] // Ejemplo de correos existentes
  return !existingEmails.includes(email)
}

const UserDialogEdit: React.FC<UserModalProps> = ({
  user,
  onClose,
  editable = false,
  onSave,
}) => {
  const [editedUser, setEditedUser] = useState<TransformedUser | null>(user)
  const [passwordError, setPasswordError] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  useEffect(() => {
    setEditedUser(user)
    setConfirmPassword('') // Resetear el estado de confirmPassword cuando el usuario cambia
  }, [user])

  useEffect(() => {
    if (editedUser && editedUser.email) {
      validateEmail(editedUser.email)
    }
  }, [editedUser?.email])

  if (!user) return null

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.'
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula.'
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula.'
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número.'
    }
    if (/(\d)\1{2}/.test(password)) {
      return 'La contraseña no puede contener tres números consecutivos iguales.'
    }
    return ''
  }

  const validateEmail = async (email: string) => {
    const isUnique = await isEmailUnique(email)
    if (!isUnique) {
      setEmailError('El email ya está en uso.')
    } else {
      setEmailError('')
    }
  }

  const handleChange = async (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target

    if (editedUser) {
      if (name === 'password') {
        const error = validatePassword(value as string)
        setPasswordError(error)
        setEditedUser({ ...editedUser, [name as string]: value })
      } else if (name === 'confirmPassword') {
        setConfirmPassword(value as string)
        if (value !== editedUser.password) {
          setConfirmPasswordError('Las contraseñas no coinciden.')
        } else {
          setConfirmPasswordError('')
        }
      } else if (name === 'email') {
        setEditedUser({ ...editedUser, [name as string]: value })
        await validateEmail(value as string)
      } else {
        setEditedUser({ ...editedUser, [name as string]: value })
      }
    }
  }

  const handleSave = () => {
    if (
      onSave &&
      editedUser &&
      !passwordError &&
      !confirmPasswordError &&
      !emailError
    ) {
      onSave(editedUser)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
  const handleClose = () => {
    setEditedUser(null)
    onClose()
  }
  return (
    <Modal open={!!user} onClose={handleClose}>
      <Paper style={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar>{user.fullname.charAt(0)}</Avatar>
            <Box ml={2}>
              <Typography variant="h6">{user.fullname}</Typography>
              <Typography variant="subtitle1">{user.type}</Typography>
              <Typography variant="body2">
                Usuario creado el {user.createdAt}
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
          value={editedUser ? editedUser.fullname : ''}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={editedUser ? editedUser.email : ''}
          margin="dense"
          onChange={handleChange}
          error={!!emailError}
          helperText={emailError}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <TextField
          fullWidth
          label="Contraseña"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={editedUser?.password || ''}
          margin="dense"
          onChange={handleChange}
          error={!!passwordError}
          helperText={passwordError}
          InputProps={{
            readOnly: !editable,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {editable && (
          <TextField
            fullWidth
            label="Confirmar contraseña"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            margin="dense"
            onChange={handleChange}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            InputProps={{
              readOnly: !editable,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
        <FormControl fullWidth margin="dense">
          <InputLabel>Tipo de usuario</InputLabel>
          <Select
            name="type"
            value={editedUser ? editedUser.type : ''}
            onChange={handleChange}
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
              disabled={
                !!passwordError || !!confirmPasswordError || !!emailError
              }
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
