import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { SuppliesCreateData } from '../../interfaces/Supplies'

const useStyles = makeStyles((theme) => ({
  imageUploadContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  imagePreview: {
    width: 150,
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#999',
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  input: {
    display: 'none',
  },
}))

interface SuppliesDialogCreateProps {
  open: boolean
  onClose: () => void
  onSave: (supplies: SuppliesCreateData) => void
}

const SuppliesDialogCreate: React.FC<SuppliesDialogCreateProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const classes = useStyles()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [minStock, setMinStock] = useState<number | string>('')
  const [maxStock, setMaxStock] = useState<number | string>('')
  const [packageSize, setPackageSize] = useState<number | string>('')
  const [unit, setUnit] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleSave = () => {
    const newSupplies: SuppliesCreateData = {
      name,
      updatedAt: new Date().toLocaleDateString(),
      createdAt: new Date().toLocaleDateString(),
      description,
      size: Number(packageSize),
      unit,
      min_stock: Number(minStock),
      max_stock: Number(maxStock),
      image: imageUrl,
    }

    onSave(newSupplies)
    setName('')
    setDescription('')
    setMinStock('')
    setMaxStock('')
    setPackageSize('')
    setUnit('')
    setImageUrl('')
    setImageFile(null)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear un nuevo insumo</DialogTitle>
      <DialogContent>
        <div className={classes.imageUploadContainer}>
          <div className={classes.imagePreview}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Insumo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>Imagen del insumo</span>
            )}
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="icon-button-file">
              <IconButton className={classes.addButton}>
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: 16, height: 16 }}
                />
              </IconButton>
            </label>
          </div>
        </div>

        <TextField
          margin="dense"
          label="Nombre"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Stock mínimo"
          type="number"
          fullWidth
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Stock máximo"
          type="number"
          fullWidth
          value={maxStock}
          onChange={(e) => setMaxStock(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Tamaño del paquete"
          type="number"
          fullWidth
          value={packageSize}
          onChange={(e) => setPackageSize(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Unidad de medida"
          type="text"
          fullWidth
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
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

export default SuppliesDialogCreate
