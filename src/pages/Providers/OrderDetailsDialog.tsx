import React, { ChangeEvent, useEffect, useState } from 'react'
import { OrderResponse, OrderState } from '../../interfaces/Orders'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from '@material-ui/core'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const { CREATED, PENDING, CANCELLED, COMPLETED } = OrderState

export interface onSaveOrder {
  id: string
  state: OrderState
  cancelled_description?: string
  supplies?: { product: string; quantity: number }[]
}

interface OrderDetailsModalProps {
  order: OrderResponse | null
  isOpen: boolean
  onClose: () => void
  onSave: (order: onSaveOrder) => void
  supplies: SuppliesResponse[]
}

const OrderDetailsDialog: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onSave,
  supplies,
}) => {
  const [selectedState, setSelectedState] = useState<OrderState>(
    order?.state ?? CREATED
  )
  const [selectedSupplies, setSelectedSupplies] = useState<
    { supplyId: string; quantity: number }[]
  >(
    order?.supplies.map((s) => ({
      supplyId: s.supplyId._id,
      quantity: s.quantity,
    })) || []
  )
  const [cancelled_description, setCancelledDescription] = useState(
    order?.cancelled_description ?? ''
  )

  if (!order) return null

  const getOrderStatusList = (currentState: OrderState) => {
    switch (currentState) {
      case CREATED:
        return [CREATED, PENDING]
      case PENDING:
        return [PENDING, CANCELLED, COMPLETED]
      case CANCELLED:
        return [CANCELLED, CREATED]
      case COMPLETED:
        return [COMPLETED]
      default:
        return []
    }
  }

  const originalState = order.state
  const noActions = originalState === CANCELLED || originalState === COMPLETED
  const isPending = originalState === PENDING

  const handleSave = () => {
    if (order) {
      const orderRequestBody = {
        id: order._id,
        state: selectedState,
        cancelled_description,
        supplies: selectedSupplies.map((supply) => ({
          product: supply.supplyId,
          quantity: supply.quantity,
        })),
      }

      if (selectedState === CANCELLED && !cancelled_description)
        return toast.error(
          'Debe ingresar una descripción para cancelar el pedido'
        )

      onSave(orderRequestBody)
    }
  }

  const handleAddSupply = () => {
    const newSupply = supplies.find(
      (supply) => !selectedSupplies.some((s) => s.supplyId === supply._id)
    )
    if (newSupply) {
      setSelectedSupplies((prev) => [
        ...prev,
        { supplyId: newSupply._id, quantity: 1 },
      ])
    }
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
          disabled
        />
        <TextField
          label="Proveedor que entrega"
          value={order.provider.name}
          fullWidth
          margin="normal"
          disabled
        />
        {selectedSupplies.map((item, index) => (
          <SuppliesList
            key={index}
            supplies={supplies}
            item={item}
            readOnly={noActions}
            orderNumber={index + 1}
            selectedSupplies={selectedSupplies}
            setSelectedSupplies={setSelectedSupplies}
            isPending={isPending}
          />
        ))}
        <Tooltip
          arrow
          title={
            supplies.length === selectedSupplies.length
              ? 'No hay más insumos disponibles para agregar'
              : ''
          }
        >
          <span>
            <Button
              onClick={handleAddSupply}
              variant="contained"
              color="primary"
              disabled={
                supplies.length === selectedSupplies.length ||
                noActions ||
                isPending
              }
            >
              Agregar Insumo
            </Button>
          </span>
        </Tooltip>
        <TextField
          select
          label="Estado del pedido"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value as OrderState)
          }}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: noActions,
          }}
        >
          {getOrderStatusList(originalState).map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
        {selectedState === CANCELLED && (
          <TextField
            label="Motivo de cancelación"
            value={cancelled_description}
            onChange={(e) => setCancelledDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              readOnly: noActions,
            }}
          />
        )}
        {order.received_date && (
          <TextField
            label="Este pedido fue recibido el"
            value={new Date(order.received_date).toLocaleDateString()} // Muestra la fecha en formato legible
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          CERRAR
        </Button>
        {!noActions && (
          <Button onClick={handleSave} color="primary" variant="contained">
            GUARDAR
          </Button>
        )}
      </DialogActions>
      <ToastContainer />
    </Dialog>
  )
}

const SuppliesList = ({
  supplies,
  item,
  readOnly,
  orderNumber,
  selectedSupplies,
  setSelectedSupplies,
  isPending,
}: {
  supplies: SuppliesResponse[]
  item: { supplyId: string; quantity: number }
  readOnly: boolean
  orderNumber: number
  selectedSupplies: { supplyId: string; quantity: number }[]
  setSelectedSupplies: React.Dispatch<
    React.SetStateAction<{ supplyId: string; quantity: number }[]>
  >
  isPending: boolean
}) => {
  const [selectedSupply, setSelectedSupply] = useState<string>(item.supplyId)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    item.quantity
  )

  function handleQuantityChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setSelectedQuantity(parseInt(event.target.value))
    setSelectedSupplies((prev) =>
      prev.map((supply) =>
        supply.supplyId === item.supplyId
          ? { ...supply, quantity: parseInt(event.target.value) }
          : supply
      )
    )
  }

  function handleSupplyChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    const isSupplyAlreadySelected = selectedSupplies.some(
      (supply) => supply.supplyId === event.target.value
    )

    if (!isSupplyAlreadySelected) {
      setSelectedSupply(event.target.value)
      setSelectedSupplies((prev) =>
        prev.map((supply) =>
          supply.supplyId === item.supplyId
            ? { ...supply, supplyId: event.target.value }
            : supply
        )
      )
    }
  }

  function handleRemoveSupply(): void {
    setSelectedSupplies((prev) =>
      prev.filter((supply) => supply.supplyId !== item.supplyId)
    )
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <TextField
          select
          label={`Insumo ${orderNumber}`}
          fullWidth
          value={selectedSupply}
          defaultValue={''}
          onChange={handleSupplyChange}
          disabled={readOnly || isPending}
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
          value={selectedQuantity}
          onChange={handleQuantityChange}
          disabled={readOnly || isPending}
          inputProps={{ max: 1000 }}
        />
        <Tooltip
          arrow
          title={
            selectedSupplies.length === 1
              ? 'No se puede eliminar el último insumo'
              : 'Eliminar insumo'
          }
        >
          <span>
            <IconButton
              onClick={() => handleRemoveSupply()}
              disabled={selectedSupplies.length === 1 || readOnly || isPending}
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </>
  )
}

export default OrderDetailsDialog
