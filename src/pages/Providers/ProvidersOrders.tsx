import { useEffect, useState } from 'react'
import GenericTable, { Column } from '../../components/GenericTable'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import ProviderOrderDialogCreate from './ProviderOrderDialogCreate'
import { ProviderResponse } from '../../interfaces/Providers'
import {
  OrderBody,
  OrderResponse,
  OrderState,
  OrderStateFilter,
  TransformedOrder,
} from '../../interfaces/Orders'
import { request } from '../../common/request'
import { formatISODateString } from '../../utils/dateUtils'
import { useParams } from 'react-router-dom'
import OrderDetailsDialog, { onSaveOrder } from './OrderDetailsDialog'
import { toast, ToastContainer } from 'react-toastify'
import { FilterSelect, orderStateOptions } from '../../components/FilterSelect'

const columns: Column<TransformedOrder>[] = [
  {
    id: '_id',
    label: 'ID',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'number', label: 'Número de Pedido' },
  { id: 'state', label: 'Estado', hiddenFilter: true },
  {
    id: 'created_at',
    label: 'Fecha de Creación',
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'provider', label: 'Proveedor' },
  { id: 'supplies', label: 'Insumos', hiddenFilter: true },
]

export default function ProvidersOrders() {
  const [transfOrders, setTransfOrders] = useState<TransformedOrder[]>([])
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [providers, setProviders] = useState<ProviderResponse[]>([])
  const [selectedState, setSelectedState] = useState<OrderStateFilter>(
    OrderStateFilter.PENDING
  )
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null)
  const { id } = useParams()
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderResponse | null>(null)
  const supplies =
    providers.find((p) => p._id === selectedProvider?._id)?.supplies || []

  useEffect(() => {
    toast.promise(Promise.all([getProviders(), getOrders(selectedState)]), {
      pending: 'Cargando pedidos...',
      success: 'Pedidos cargados',
      error: 'Error al cargar los pedidos',
    })
  }, [])

  useEffect(() => {
    if (id && orders.length > 0) {
      const originalOrder = orders.find(
        (order) => order.number.toString() === id
      )
      if (originalOrder) {
        setSelectedOrder(originalOrder)
      } else {
        console.error('No se encontró el pedido original para ver.')
      }
    }
  }, [id, orders])

  const dropdownOptions = columns
    .filter((column) => !column.hiddenFilter)
    .map((column) => ({
      title: column.label,
    }))

  const onAdd = () => {
    setIsCreateMode(true)
  }

  const onClose = () => {
    setIsCreateMode(false)
    setSelectedProvider(null)
    setSelectedOrder(null)
  }

  const handleChangeOrderState = (value: OrderStateFilter) => {
    setSelectedState(value)
    getOrders(value)
  }

  const onView = (orderView: TransformedOrder) => {
    const originalOrder = orders.find((order) => order._id === orderView._id)
    if (originalOrder) {
      setSelectedOrder(originalOrder)
      setSelectedProvider(
        providers.find((p) => p._id === originalOrder.provider._id) || null
      )
    } else {
      console.error('No se encontró el pedido original para ver.')
    }
  }

  const onSave = async (order: {
    provider: ProviderResponse
    supplies: { product: string; quantity: number }[]
  }) => {
    try {
      const orderToSave: OrderBody = {
        created_at: new Date().toISOString(),
        provider: order.provider._id,
        supplies: order.supplies.map((item, i) => ({
          supplyId: item.product,
          quantity: item.quantity,
        })),
      }
      await request<OrderResponse>({
        path: '/orders',
        method: 'POST',
        data: orderToSave,
      })
      setSelectedState(OrderStateFilter.CREATED)
      getOrders(OrderStateFilter.CREATED)
      toast.success('Pedido creado correctamente')
    } catch (error) {
      toast.error(error)
    }
    onClose()
  }

  const onEdit = async (order: onSaveOrder) => {
    try {
      let res
      if (order.state !== OrderState.CREATED && order?.supplies?.length === 0) {
        res = await request({
          path: `/orders/${order.id}`,
          method: 'POST',
          data: {
            state: order.state,
            cancelled_description: order.cancelled_description,
          },
        })
      } else {
        res = await request({
          path: `/orders/${order.id}`,
          method: 'PATCH',
          data: {
            state: order.state,
            cancelled_description: order.cancelled_description,
            supplies: order.supplies?.map((item, i) => ({
              supplyId: item.product,
              quantity: item.quantity,
            })),
          },
        })
      }
      if (res) {
        setSelectedState(OrderStateFilter.ALL)
        getOrders(OrderStateFilter.ALL)
        toast.success('Pedido actualizado correctamente')
      }
      onClose()
    } catch (error) {
      if (error instanceof Error)
        toast.error((error as any).response?.data.message || error.message)
      else toast.error('An unknown error occurred')
    }
  }

  const getProviders = async () => {
    try {
      const res = await request<ProviderResponse[]>({
        path: '/providers',
        method: 'GET',
      })
      if (res) setProviders(res)
    } catch (error) {
      console.error('Error al obtener proveedores:', error)
    }
  }

  const transformOrder = (order: OrderResponse): TransformedOrder => ({
    _id: order._id,
    number: order.number,
    created_at: formatISODateString(order.created_at),
    provider: order.provider.name,
    supplies: order.supplies.map((supply) => supply.supplyId.name).join(', '),
    state: order.state,
  })

  const getOrders = async (value: OrderStateFilter) => {
    try {
      const res = await request<OrderResponse[]>({
        path:
          value === OrderStateFilter.ALL ? '/orders' : `/orders?state=${value}`,
        method: 'GET',
      })
      if (res) {
        setOrders(res)
        setTransfOrders(res.map(transformOrder))
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pedidos a Proveedores</h1>
      <FilterSelect<OrderStateFilter>
        value={selectedState}
        onChange={handleChangeOrderState}
        options={orderStateOptions}
        title="Estado del pedido"
      />
      <GenericTable
        columns={columns}
        data={transfOrders}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onAdd={onAdd}
        nameColumnId="number"
      />
      <DownloadPdfButton url="http://localhost:3000/orders/generate-pdf" />

      {isCreateMode && (
        <ProviderOrderDialogCreate
          isOpen={isCreateMode}
          onClose={onClose}
          onSave={onSave}
          providers={providers}
          supplies={supplies}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
        />
      )}

      {selectedOrder && (
        <OrderDetailsDialog
          isOpen={Boolean(selectedOrder)}
          onClose={onClose}
          order={selectedOrder}
          onSave={onEdit}
          supplies={supplies}
        />
      )}
      <ToastContainer />
    </div>
  )
}
