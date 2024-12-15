import { useState, useEffect } from 'react'
import GenericTable, { Column } from '../../components/GenericTable'
import WasteReportDialog from './wasteReportsDialog'
import { request, requestToast } from '../../common/request'
import { UsersResponse } from '../../interfaces/Users'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  WasteBody,
  WasteFormData,
  WasteReport,
  WasteResponse,
} from '../../interfaces/Waste'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { formatISODateString } from '../../utils/dateUtils'
import { Typography } from '@material-ui/core'
import { AxiosError } from 'axios'

const columns: Column<WasteReport>[] = [
  {
    id: 'id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'date', label: 'Fecha', hiddenFilter: true },
  { id: 'reportingEmployee', label: 'Empleado que reporta' },
  { id: 'reason', label: 'Motivo' },
  { id: 'involvedEmployee', label: 'Empleado involucrado' },
  { id: 'wastedSupplies', label: 'Insumos desperdiciados' },
]

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function WasteReports() {
  const [selectedWaste, setSelectedWaste] = useState<WasteResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [users, setUsers] = useState<UsersResponse[]>([])
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [wastes, setWastes] = useState<WasteResponse[]>([])
  const [data, setData] = useState<WasteReport[]>([]) // Mock data reemplazable con datos reales.

  // Función para obtener usuarios
  const getUsers = async () => {
    try {
      const res = await request<UsersResponse[]>({
        path: '/users',
        method: 'GET',
      })
      if (res) {
        setUsers(res)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Función para obtener insumos
  const getSupplies = async () => {
    try {
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
      })
      if (res) {
        setSupplies(res.filter((supply) => supply.current_stock > 0))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getWastes = async () => {
    try {
      const res = await request<WasteResponse[]>({
        path: '/waste',
        method: 'GET',
      })
      if (res) {
        setWastes(res)
        const transformedData = res.map((item) => ({
          id: item._id,
          date: formatISODateString(item.date),
          reportingEmployee: item.reporter.fullname,
          reason: item.motive,
          involvedEmployee: item.responsible?.fullname ?? 'N/A',
          wastedSupplies: item.supplies
            .map((supply) => supply.supplyId.name)
            .join(', '),
        }))
        setData(transformedData)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Función para manejar la vista del diálogo
  const onView = (wasteReport: WasteReport) => {
    const selected =
      wastes.find((waste) => waste._id === wasteReport.id) ?? null
    if (!selected) return

    setSelectedWaste(selected)
    setIsDialogOpen(true)
  }

  // Función para cerrar el diálogo
  const onClose = () => {
    setSelectedWaste(null)
    setIsDialogOpen(false)
  }

  // Función para agregar un nuevo reporte
  const onAdd = () => {
    setSelectedWaste(null)
    setIsDialogOpen(true)
  }

  // Obtener datos iniciales
  useEffect(() => {
    toast.promise(Promise.all([getUsers(), getSupplies(), getWastes()]), {
      pending: 'Cargando desperdicios de inventario...',
      success: 'Desperdicios de inventario cargados',
      error: 'Error al cargar desperdicios de inventario',
    })
  }, [])

  const handleSave = async (formData: WasteFormData, id?: string) => {
    const isEdit = !!selectedWaste
    const transformedData: WasteBody = {
      motive: formData.reason,
      supplies: formData.items.map((item) => ({
        supplyId: item.supplyId,
        quantity: parseInt(item.quantity),
      })),
      reporter: formData.reporter.id,
      responsible: formData.involved.id,
      date: formData.date,
    }

    try {
      const res = await requestToast<any[]>({
        path: isEdit ? `/waste/${id}` : '/waste',
        method: isEdit ? 'PATCH' : 'POST',
        data: transformedData,
        successMessage: 'Desperdicio de inventario cargado',
        errorMessage: 'Error al cargar desperdicio de inventario',
        pendingMessage: 'Cargando desperdicio de inventario...',
      })
      if (res) {
        getWastes()
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Desperdicio de inventario</h1>
      <Typography variant="body1">
        En esta sección podrás visualizar y agregar desperdicios de inventario.
        Los insumos se descontarán del stock disponible, priorizando aquellos
        con fecha de vencimiento más próxima.
      </Typography>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions}
        onAdd={onAdd}
        onView={onView}
        nameColumnId="reason"
        nameButton="Agregar desperdicio"
      />
      {isDialogOpen && (
        <WasteReportDialog
          open={isDialogOpen}
          onClose={onClose}
          onSave={(formData, id) => handleSave(formData, id)}
          users={users}
          supplies={supplies}
          formData={selectedWaste}
        />
      )}
      <ToastContainer />
    </div>
  )
}
