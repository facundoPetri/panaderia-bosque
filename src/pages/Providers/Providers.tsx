import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GenericTable from '../../components/GenericTable'
import { Column } from '../../components/GenericTable'
import ProviderDialogEdit from './ProviderDialogEdit'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { request, requestToast } from '../../common/request'
import ProviderDialogCreate from './ProviderDialogCreate'
import {
  ProviderResponse,
  TransformedProvider,
} from '../../interfaces/Providers'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import { API_BASE_URL } from '../../common/commonConsts'
import { Typography } from '@material-ui/core'
import { AxiosError } from 'axios'

const columns: Column<TransformedProvider>[] = [
  {
    id: '_id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'name', label: 'Nombre' },
  { id: 'phone', label: 'Telefono', sortable: false, hiddenFilter: true },
  { id: 'email', label: 'Email', hiddenFilter: true },
  { id: 'supplies', label: 'Insumos' },
]

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function Providers() {
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderResponse | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [providers, setProviders] = useState<ProviderResponse[]>([])
  const [transformedProvider, setTransformedProvider] = useState<
    TransformedProvider[]
  >([])

  const onView = (provider: TransformedProvider) => {
    const selected = providers.find((p) => p._id === provider._id)
    if (selected) {
      setSelectedProvider(selected)
    }
    setIsEditMode(false)
  }

  const onClose = () => {
    setSelectedProvider(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const onDelete = async (id: string) => {
    try {
      const res = await requestToast<any[]>({
        path: `/providers/${id}`,
        method: 'DELETE',
        successMessage: 'Proveedor eliminado',
        errorMessage: 'Error al eliminar proveedor',
        pendingMessage: 'Eliminando proveedor...',
      })
      if (res) {
        getProviders()
      }
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error)
    }
  }

  const onAdd = () => {
    setIsCreateMode(true)
  }

  const onEdit = (provider: TransformedProvider) => {
    const selected = providers.find((p) => p._id === provider._id)
    if (selected) {
      setSelectedProvider(selected)
    }
    setIsEditMode(true)
  }

  const getSupplies = async () => {
    try {
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
      })
      if (res) {
        setSupplies(res)
      }
    } catch (error) {
      console.error('Error al obtener insumos:', error)
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
        const transformedData = transformData(res)
        setTransformedProvider(transformedData)
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error)
    }
  }

  const handleSave = async (provider: ProviderResponse) => {
    try {
      const res = await requestToast<any[]>({
        path: `/providers/${provider._id}`,
        method: 'PATCH',
        data: {
          ...provider,
          supplies: provider.supplies.map((supply) => supply._id),
        },
        successMessage: 'Proveedor actualizado',
        errorMessage: 'Error al actualizar proveedor',
        pendingMessage: 'Actualizando proveedor...',
      })
      if (res) {
        getProviders()
      }
    } catch (error) {
      console.error('Error al guardar proveedor:', error)
    }
    onClose()
  }

  const handleCreate = async (provider: ProviderResponse) => {
    try {
      const res = await requestToast<any[]>({
        path: '/providers',
        method: 'POST',
        data: provider,
        successMessage: 'Proveedor creado',
        errorMessage: 'Error al crear proveedor',
        pendingMessage: 'Creando proveedor...',
      })
      if (res) {
        getProviders()
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, { autoClose: false })
      } else {
        toast.error('An unknown error occurred')
      }
    }
    onClose()
  }

  const transformData = (data: ProviderResponse[]): TransformedProvider[] => {
    return data.map((provider) => ({
      ...provider,
      supplies: provider.supplies
        .map((supply: SuppliesResponse) => supply.name)
        .map((str) => str)
        .join(', '),
    }))
  }

  useEffect(() => {
    toast.promise(Promise.all([getSupplies(), getProviders()]), {
      pending: 'Cargando proveedores...',
      success: 'Proveedores cargados',
      error: 'Error al cargar proveedores',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Listado de proveedores</h1>
      <Typography variant="body1">
        Aquí puedes ver la lista de proveedores y los insumos que suministran.
      </Typography>
      <GenericTable
        columns={columns}
        data={transformedProvider}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onEdit={onEdit}
        onAdd={onAdd}
        nameColumnId="name"
      />
      <ProviderDialogEdit
        provider={selectedProvider}
        onClose={onClose}
        onSave={handleSave}
        editable={isEditMode}
        supplies={supplies}
      />
      <ProviderDialogCreate
        open={isCreateMode}
        onClose={onClose}
        onSave={handleCreate}
        supplies={supplies}
      />
      <ToastContainer />
      <DownloadPdfButton url={`${API_BASE_URL}/providers/generate-pdf`} />
    </div>
  )
}
