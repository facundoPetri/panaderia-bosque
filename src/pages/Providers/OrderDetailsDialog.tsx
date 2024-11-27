import React from 'react'
import { OrderResponse, OrderState } from '../../interfaces/Orders'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@material-ui/core'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { ca } from 'date-fns/locale'

interface OrderDetailsModalProps {
  order: OrderResponse | null
  isOpen: boolean
  onClose: () => void
  onSave: (order: {
    id: string
    state: string
    cancelled_description?: string
  }) => void
  supplies: SuppliesResponse[]
}

const OrderDetailsDialog: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onSave,
  supplies,
}) => {
  const [selectedState, setSelectedState] = React.useState<OrderState>(
    order?.state ?? OrderState.CREATED
  )
  const handleSave = () => {
    if (order) {
      const updatedOrder = {
        id: order._id,
        state: selectedState,
        cancelled_description: '', //TODO: Implementar descripción de cancelación
      }
      onSave(updatedOrder)
    }
  }

  if (!order) {
    return null // Don't render the dialog if order is null
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{`Pedido n° ${order.number}`}</DialogTitle>
      <DialogContent>
        <TextField
          label="Fecha del pedido"
          value={new Date(order.created_at).toLocaleDateString()} // Muestra la fecha en formato legible
          fullWidth
          margin="normal"
          disabled={true}
        />
        <TextField
          label="Proveedor que entrega"
          value={order.provider.name}
          fullWidth
          margin="normal"
          disabled={true}
        />
        {order.supplies.map((item, index) => (
          <div
            key={`sup-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <TextField
              select
              label={`Insumo ${index + 1}`}
              fullWidth
              value={item.supplyId._id}
              defaultValue={''}
              disabled={true}
            >
              {supplies.map((supply) => (
                <MenuItem key={supply._id} value={supply._id}>
                  {supply.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cantidad"
              fullWidth
              value={item.quantity}
              disabled={true}
            />
          </div>
        ))}
        <TextField
          select
          label="Estado del pedido"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value as OrderState)
          }}
          fullWidth
          margin="normal"
        >
          {Object.values(OrderState).map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          CERRAR
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          GUARDAR
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderDetailsDialog
