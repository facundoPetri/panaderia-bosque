import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
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
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { ProviderResponse } from '../../interfaces/Providers'
import { validateText } from '../../utils/validateData'
import { toast } from 'react-toastify'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  modalTitle: {
    marginBottom: theme.spacing(2),
  },
  select: {
    marginTop: '1rem',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: '0.75rem',
    color: '#888',
  },
  imagePreview: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: 200,
    borderRadius: theme.spacing(1),
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
    estimated_delivery_time: 0,
    supplies: [],
    image: '',
    createdAt: new Date(),
  })
  const [imageUrl, setImageUrl] = useState('')

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target
    if (!name) return

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isFormValid = (): boolean => {
    const isNameValid = validateText(formData.name, { required: true, maxLength: 50 }, 'Nombre')
    const isEmailValid = validateText(formData.email, { required: true, maxLength: 50 }, 'Email')
    const isPhoneValid = validateText(formData.phone, { required: true, maxLength: 50 }, 'Teléfono')
    const isSuppliesValid =
      formData.supplies.length > 0 ||
      (toast.error('Debes seleccionar al menos un insumo.'), false)

    return isNameValid && isEmailValid && isPhoneValid && isSuppliesValid
  }

  const handleSave = () => {
    if (isFormValid()) {
      onSave({ ...formData, image: imageUrl })
      onClose()
    }
  }

  useEffect(() => {
    if (!open) {
      setFormData({
        _id: '',
        name: '',
        email: '',
        phone: '',
        estimated_delivery_time: 0,
        supplies: [],
        image: '',
        createdAt: new Date(),
      })
      setImageUrl('')
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" className={classes.modalTitle}>
          Crear un nuevo proveedor
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
        <TextField
          margin="dense"
          label="Insertar URL de imagen"
          type="url"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {imageUrl && (
          <div className={classes.imagePreview}>
            <img src={imageUrl} alt="Vista previa" className={classes.image} />
          </div>
        )}
        <TextField
          margin="dense"
          name="name"
          label="Nombre"
          type="text"
          fullWidth
          required
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          inputProps={{
            maxLength: 50,
          }}
          helperText={`${formData.name.length}/50`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          required
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          inputProps={{
            maxLength: 50,
          }}
          helperText={`${formData.email.length}/50`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Teléfono"
          type="text"
          fullWidth
          required
          variant="outlined"
          value={formData.phone}
          onChange={handleChange}
          inputProps={{
            maxLength: 50,
          }}
          helperText={`${formData.phone.length}/50`}
          FormHelperTextProps={{ className: classes.characterCount }}
        />
        <FormControl fullWidth>
          <InputLabel id="insumosSelector">Insumos</InputLabel>
          <Select
            labelId="insumosSelector"
            className={classes.select}
            name="supplies"
            multiple
            required
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

export default ProviderDialogCreate
