import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GenericTable, { Column } from '../../components/GenericTable'
import SuppliesDialogEdit from './SuppliesDialogEdit'
import SuppliesDialogCreate from './SuppliesDialogCreate'
import { requestToast } from '../../common/request'
import { SuppliesCreateData, SuppliesResponse } from '../../interfaces/Supplies'
import { formatISODateString } from '../../utils/dateUtils'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import { API_BASE_URL } from '../../common/commonConsts'
import { AxiosError } from 'axios'

const columns: Column<SuppliesResponse>[] = [
  {
    id: '_id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'name', label: 'Nombre' },
  { id: 'createdAt', label: 'Fecha de creación', hiddenFilter: true },
  { id: 'description', label: 'Descripción', hiddenFilter: true },
  // TODO: Agregar usedIn que seria en que recetas se usa
]

const dropdownOptions = columns
  .filter((column) => column.hiddenFilter !== true)
  .map((column) => ({
    title: column.label,
  }))

export default function Supplies() {
  const [selectedSupplies, setSelectedSupplies] =
    useState<SuppliesResponse | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const userType = sessionStorage.getItem('userType')
  const onView = (supplies: SuppliesResponse) => {
    setSelectedSupplies(supplies)
    setIsEditMode(false)
  }

  const onClose = () => {
    setSelectedSupplies(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const onDelete = async (id: string) => {
    try {
      const res = await requestToast<any[]>({
        path: `/supplies/${id}`,
        method: 'DELETE',
        successMessage: 'Insumo eliminado',
        errorMessage: 'Error al eliminar insumo',
        pendingMessage: 'Eliminando insumo...',
      })
      if (res) {
        getSupplies()
      }
    } catch (error) {
      console.error(error)
    }
    // Aquí puedes llamar a tu servicio de eliminación con el id
  }

  const onAdd = () => {
    setIsCreateMode(true)
  }

  const handleEdit = (supplies: SuppliesResponse) => {
    setSelectedSupplies(supplies)
    setIsEditMode(true)
  }

  const getSupplies = async () => {
    try {
      const res = await requestToast<SuppliesResponse[]>({
        path: '/supplies?order_by=name',
        method: 'GET',
        successMessage: 'Insumos cargados',
        errorMessage: 'Error al cargar insumos',
        pendingMessage: 'Cargando insumos...',
      })
      if (res) {
        const formattedSupplies = res.map((supplie) => ({
          ...supplie,
          createdAt: formatISODateString(supplie.createdAt),
        }))
        setSupplies(formattedSupplies)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getSupplies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //editting supplies
  const handleSave = async (supplies: SuppliesResponse) => {
    const data = {
      name: supplies.name,
      description: supplies.description,
      min_stock: supplies.min_stock,
      max_stock: supplies.max_stock,
      size: supplies.size,
      unit: supplies.unit,
    }

    try {
      const res = await requestToast<any[]>({
        path: `/supplies/${supplies._id}`,
        method: 'PATCH',
        data,
        successMessage: 'Insumo actualizado',
        errorMessage: 'Error al actualizar insumo',
        pendingMessage: 'Actualizando insumo...',
      })
      if (res) {
        getSupplies()
      }
    } catch (error) {
      console.error(error)
    }
    setSelectedSupplies(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const handleCreate = async (supplies: SuppliesCreateData) => {
    const data = {
      name: supplies.name,
      description: supplies.description,
      min_stock: supplies.min_stock,
      max_stock: supplies.max_stock,
      size: supplies.size,
      unit: supplies.unit,
    }

    try {
      const res = await requestToast<any[]>({
        path: '/supplies',
        method: 'POST',
        data,
        successMessage: 'Insumo creado',
        errorMessage: 'Error al crear insumo',
        pendingMessage: 'Creando insumo...',
      })
      if (res) {
        getSupplies()
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, { autoClose: false })
      } else {
        toast.error('An unknown error occurred')
      }
    }
    setIsCreateMode(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de insumos</h1>
      <GenericTable
        columns={columns}
        data={supplies}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        nameColumnId="name"
        disableCreate={userType === 'user'}
        disableEdit={userType === 'user'}
      />
      <SuppliesDialogCreate
        open={isCreateMode}
        onClose={onClose}
        onSave={handleCreate}
      />
      <SuppliesDialogEdit
        selectedSupplies={selectedSupplies}
        onClose={onClose}
        editable={isEditMode}
        onSave={handleSave}
      />
      <ToastContainer />
      <DownloadPdfButton url={`${API_BASE_URL}/supplies/generate-pdf`} />
    </div>
  )
}
