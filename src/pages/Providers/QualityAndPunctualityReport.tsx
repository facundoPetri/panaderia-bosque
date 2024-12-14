import { useEffect, useState } from 'react'
import GenericTable from '../../components/GenericTable'
import { Column } from '../../components/GenericTable'
import QAndPDialog from './QualityAndPunctualityDialog'
import { UsersResponse } from '../../interfaces/Users'
import { request, requestToast } from '../../common/request'
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core'
import {
  PostReportingOrder,
  QualityAndPunctuality,
  ReportingOrderResponse,
} from '../../interfaces/ReportingOrders'
import { formatISODateString } from '../../utils/dateUtils'
import { OrderResponse } from '../../interfaces/Orders'
import { toast, ToastContainer } from 'react-toastify'

const columns: Column<QualityAndPunctuality>[] = [
  {
    id: 'id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'name', label: 'Nombre' },
  { id: 'provider', label: 'Proveedor' },
  { id: 'reportDate', label: 'Fecha de informe', hiddenFilter: true },
  { id: 'author', label: 'Autor', hiddenFilter: true },
  { id: 'deliveredItem', label: 'Insumos en el pedido' },
  {
    id: 'estimatedDate',
    label: 'Fecha estimada de entrega',
    hiddenFilter: true,
  },
  {
    id: 'receivedDate',
    label: 'Fecha en la que se recibio',
    hiddenFilter: true,
  },
  { id: 'rating', label: 'Calificación' },
]

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function QualityAndPunctualityReport() {
  const [reportingOrders, setReportingOrders] = useState<
    ReportingOrderResponse[]
  >([])
  const [selectedReport, setSelectedReport] =
    useState<ReportingOrderResponse | null>(null)
  const [transformedReports, setTransformedReports] = useState<
    QualityAndPunctuality[]
  >([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [users, setUsers] = useState<UsersResponse[]>([])
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [allOrders, setAllOrders] = useState<OrderResponse[]>([])
  const [isEdit, setIsEdit] = useState(false)
  const [isView, setIsView] = useState(false)
  const [isEmptyDataModalOpen, setIsEmptyDataModalOpen] = useState(false)

  async function getReportingOrders() {
    try {
      const res = await request<ReportingOrderResponse[]>({
        path: '/reporting-orders',
        method: 'GET',
      })
      if (res) {
        setReportingOrders(res)
        setTransformedReports(
          res.map((report) => ({
            id: report._id,
            name: report.name,
            provider: report.provider.name,
            reportDate: formatISODateString(report.created_at),
            estimatedDate: formatISODateString(report.estimated_date),
            receivedDate: formatISODateString(report.order.received_date),
            author: report.author.fullname,
            deliveredItem: report.supplies
              .map((supply) => supply.name)
              .join(', '),
            rating: report.quality,
          }))
        )
      }
    } catch (error) {
      console.error('Error al obtener órdenes de reporte:', error)
    }
  }

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

  const getOrdersToReport = async () => {
    try {
      const res = await request<OrderResponse[]>({
        path: '/orders?reported=false&state=Completado',
        method: 'GET',
      })
      if (res) {
        setOrders(res)
      }
    } catch (error) {
      console.error('Error al obtener órdenes a reportar:', error)
    }
  }

  const getAllOrders = async () => {
    try {
      const res = await request<OrderResponse[]>({
        path: '/orders',
        method: 'GET',
      })
      if (res) {
        setAllOrders(res)
      }
    } catch (error) {
      console.error('Error al obtener órdenes a reportar:', error)
    }
  }

  const onView = (report: QualityAndPunctuality) => {
    const newReport = reportingOrders.find((r) => r._id === report.id)
    if (newReport) {
      setIsView(true)
      setSelectedReport(newReport)
      setIsModalOpen(true)
    }
  }

  const onClose = () => {
    setSelectedReport(null)
    setIsView(false)
    setIsModalOpen(false)
  }

  const onSave = async (data: PostReportingOrder) => {
    try {
      const res = await requestToast<OrderResponse[]>({
        path: '/reporting-orders',
        data: data,
        method: 'POST',
        successMessage: 'Informe guardado',
        errorMessage: 'Error al guardar informe',
        pendingMessage: 'Guardando informe...',
      })
      if (res) {
        getReportingOrders()
      }
    } catch (error) {
      console.error('Error al guardar el informe:', error)
    }
    setIsModalOpen(false)
  }

  const onAdd = () => {
    if (!orders.length) {
      setIsEmptyDataModalOpen(true)
      return
    }
    setSelectedReport(null)
    setIsModalOpen(true)
  }

  const onDelete = async (id: string) => {
    if (!id) return

    try {
      await requestToast<OrderResponse[]>({
        path: `/reporting-orders/${id}`,
        method: 'DELETE',
        successMessage: 'Informe eliminado',
        errorMessage: 'Error al eliminar informe',
        pendingMessage: 'Eliminando informe...',
      })

      await getReportingOrders()
    } catch (error) {
      console.error('Error al eliminar:', error)
    }
  }

  useEffect(() => {
    toast.promise(
      Promise.all([
        getReportingOrders(),
        getOrdersToReport(),
        getUsers(),
        getAllOrders(),
      ]),
      {
        pending: 'Cargando informes sobre pedidos...',
        success: 'Informes cargados',
        error: 'Error al cargar los informes',
      }
    )
  }, [])

  const handleEdit = (row: QualityAndPunctuality): void => {
    const reportToEdit = reportingOrders.find((r) => r._id === row.id)
    if (reportToEdit) {
      setIsEdit(true)
      setSelectedReport(reportToEdit)
      setIsModalOpen(true)
    }
  }

  const onEdit = async (data: PostReportingOrder) => {
    if (!selectedReport) return
    try {
      const res = await requestToast({
        path: `/reporting-orders/${selectedReport._id}`,
        data,
        method: 'PATCH',
        successMessage: 'Informe actualizado',
        errorMessage: 'Error al actualizar informe',
        pendingMessage: 'Actualizando informe...',
      })
      if (res) {
        getReportingOrders()
        setIsEdit(false)
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('Error al actualizar el informe:', error)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Informes sobre pedidos a proveedor</h1>
      <Typography>
        Aquí se evalúa la calidad de los insumos entregados por el proveedor y
        su puntualidad de entrega.
      </Typography>
      <GenericTable
        columns={columns}
        data={transformedReports}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        nameColumnId="name"
        nameButton="Agregar"
      />
      {isModalOpen && (
        <QAndPDialog
          open={isModalOpen}
          onClose={onClose}
          onSave={isEdit ? onEdit : onSave}
          employees={users}
          orders={isEdit || isView ? allOrders : orders}
          report={selectedReport}
          isEdit={isEdit}
          isView={isView}
        />
      )}
      <Dialog
        open={isEmptyDataModalOpen}
        onClose={() => setIsEmptyDataModalOpen(false)}
      >
        <DialogTitle>No hay pedidos disponibles</DialogTitle>
        <DialogContent>
          <Typography>
            No hay pedidos completados disponibles para crear un informe.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEmptyDataModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  )
}
