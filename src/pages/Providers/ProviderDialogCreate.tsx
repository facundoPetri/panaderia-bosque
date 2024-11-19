import React, { useEffect, useState } from 'react'
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
  Typography,
  Select,
  Input,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { ProviderResponse } from '../../interfaces/Providers'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
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
  uploadInput: {
    display: 'none',
  },
  modalTitle: {
    marginBottom: theme.spacing(2),
  },
  select: {
    marginTop: '1rem',
  },
}))

interface ProviderDialogProps {
  open: boolean
  supplies: SuppliesResponse[]
  onClose: () => void
  onSave: (provider: ProviderResponse) => void
}

const ProviderDialogCreate: React.FC<ProviderDialogProps> = ({
  open,
  onClose,
  onSave,
  supplies,
}) => {
  const classes = useStyles()

  const [formData, setFormData] = useState<ProviderResponse>({
    _id: '',
    name: '',
    email: '',
    phone: '',
    estimated_delivery_time: '',
    supplies: [],
    image: '',
    createdAt: new Date(),
  })
  const [avatar, setAvatar] = useState<string | null>(null)
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name as string]: value,
    }))
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

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  useEffect(() => {
    if (!open) {
      setFormData({
        _id: '',
        name: '',
        email: '',
        phone: '',
        estimated_delivery_time: '',
        supplies: [],
        image: '',
        createdAt: new Date(),
      })
      setAvatar(null) // Resetea el avatar si es necesario
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" className={classes.modalTitle}>
          Completa los campos para crear un nuevo proveedor
        </Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
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
          margin="dense"
          name="name"
          label="Nombre"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
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
        />
        <TextField
          margin="dense"
          name="estimated_delivery_time"
          label="Tiempo de entrega"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.estimated_delivery_time}
          onChange={handleChange}
        />
        <FormControl fullWidth>
          <InputLabel id="insumosSelector">Insumos</InputLabel>
          <Select
            labelId={'insumosSelector'}
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
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProviderDialogCreate
