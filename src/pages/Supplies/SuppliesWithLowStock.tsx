import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GenericTable from '../../components/GenericTable'
import { Column } from '../../components/GenericTable'
import {
  SuppliesResponse,
  TransformedSupplies,
  Batch,
} from '../../interfaces/Supplies'
import { request } from '../../common/request'
import ProviderOrderDialogCreate from '../Providers/ProviderOrderDialogCreate'
import { ProviderResponse } from '../../interfaces/Providers'

const columns: Column<TransformedSupplies>[] = [
  {
    id: '_id',
    label: 'Id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'name', label: 'Nombre' },
  { id: 'current_stock', label: 'Stock Actual', hiddenFilter: true },
  { id: 'min_stock', label: 'Stock Mínimo', hiddenFilter: true },
  { id: 'max_stock', label: 'Stock Máximo', hiddenFilter: true },
  { id: 'unit', label: 'Unidad de Medida', hiddenFilter: true },
  { id: 'priority', label: 'Prioridad' },
]

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function SuppliesWithLowStock() {
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [supplies, setSupplies] = useState<TransformedSupplies[]>([])
  const [providers, setProviders] = useState<ProviderResponse[]>([])
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderResponse | null>(null)

  const onClose = () => {
    setIsCreateMode(false)
  }

  const onAdd = () => {
    setIsCreateMode(true)
  }

  const handlerSave = async (newOrder: {
    provider: ProviderResponse
    supplies: { product: string; quantity: number }[]
  }) => {
    try {
      const orderToSave = {
        number: newOrder.supplies.reduce((sum, item) => sum + item.quantity, 0), // Total de productos
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        provider: newOrder.provider._id,
        supplies: newOrder.supplies.map((item) => ({
          supplyId: item.product,
          quantity: item.quantity, // Cantidad seleccionada por producto
        })),
      }

      await request({
        path: '/orders',
        method: 'POST',
        data: orderToSave,
      })
      toast.success('Pedido guardado exitosamente')
      onClose()
    } catch (error) {
      console.error('Error al guardar el pedido:', error)
    }
  }

  const calculatePriority = (
    currentStock: number,
    minStock: number,
    maxStock: number
  ): string => {
    if (currentStock < minStock) return 'Alta'

    if (currentStock < (minStock + maxStock) / 2) return 'Media'

    return 'Baja'
  }

  const getSupplies = async () => {
    try {
      const res = await request<SuppliesResponse[]>({
        path: '/supplies?order_by=current_stock',
        method: 'GET',
      })

      if (res) {
        const transformedSupplies = res.map((supply) => {
          const batches: Batch[] = supply.batches || []

          const currentStock = batches.reduce(
            (total, batch) => total + batch.quantity,
            0
          )

          const priority = calculatePriority(
            currentStock,
            supply.min_stock,
            supply.max_stock
          )

          return {
            ...supply,
            current_stock: currentStock,
            priority,
          }
        })

        setSupplies(transformedSupplies)
      }
    } catch (error) {
      console.error('Error al obtener los insumos:', error)
    }
  }

  const getProviders = async () => {
    try {
      const res = await request<ProviderResponse[]>({
        path: '/providers',
        method: 'GET',
      })
      if (res) {
        setProviders(res)
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error)
    }
  }

  useEffect(() => {
    toast.promise(Promise.all([getSupplies(), getProviders()]), {
      pending: 'Cargando insumos...',
      success: 'Insumos cargados',
      error: 'Error al cargar insumos',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de insumos con bajo stock</h1>
      <GenericTable
        columns={columns}
        data={supplies}
        dropdownOptions={dropdownOptions}
        onView={() => {}}
        onDelete={() => {}}
        onAdd={onAdd}
        nameColumnId="name"
        nameButton={'Hacer Pedido'}
        hiddenButtonModal={false}
      />
      {isCreateMode && (
        <ProviderOrderDialogCreate
          isOpen={isCreateMode}
          onClose={onClose}
          onSave={handlerSave}
          providers={providers}
          supplies={supplies}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
        />
      )}
      <ToastContainer />
    </div>
  )
}
