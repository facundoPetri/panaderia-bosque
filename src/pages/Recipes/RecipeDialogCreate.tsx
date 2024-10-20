import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Avatar,
  Select,
  MenuItem,
  Input,
  FormControl,
  InputLabel,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { SuppliesResponse } from '../../interfaces/Supplies'

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
  select: {
    marginTop: '1rem',
  },
})

interface RecipeDialogCreateProps {
  open: boolean
  onClose: () => void
  onSave: (recipe: any) => void
  supplies: SuppliesResponse[]
}

const RecipeDialogCreate: React.FC<RecipeDialogCreateProps> = ({
  open,
  onClose,
  onSave,
  supplies,
}) => {
  const classes = useStyles()
  const [formData, setFormData] = useState({
    name: '',
    supplies: [],
    steps: '',
    recommendations: '',
    standardUnits: '',
  })
  const [avatar, setAvatar] = useState<string | null>(null)
  useEffect(() => {
    if (!open) {
      // Limpiar el formulario y el avatar al cerrar el diálogo
      setFormData({
        name: '',
        supplies: [],
        steps: '',
        recommendations: '',
        standardUnits: '',
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
      <DialogTitle id="form-dialog-title">Crear Receta</DialogTitle>
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
          name="name"
          label="Nombre"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
        <FormControl fullWidth>
          <InputLabel id="insumosSelector">Insumos</InputLabel>
          <Select
            labelId="insumosSelector"
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

        <TextField
          margin="dense"
          name="steps"
          label="Procedimiento"
          type="text"
          fullWidth
          value={formData.steps}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="recommendations"
          label="Recomendaciones"
          type="text"
          fullWidth
          value={formData.recommendations}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="standardUnits"
          label="Estandar de unidades por día"
          type="text"
          fullWidth
          value={formData.standardUnits}
          onChange={handleChange}
        />
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

export default RecipeDialogCreate
