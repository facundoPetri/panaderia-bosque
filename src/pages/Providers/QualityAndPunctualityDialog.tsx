import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from '@material-ui/core'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { UsersResponse } from '../../interfaces/Users'
import { Rating } from '@material-ui/lab'
import { OrderResponse } from '../../interfaces/Orders'
import {
  PostReportingOrder,
  ReportingOrderResponse,
} from '../../interfaces/ReportingOrders'

interface ReportModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  employees: UsersResponse[]
  orders: OrderResponse[]
  report: ReportingOrderResponse | null
  isEdit: boolean
  isView: boolean
}

const QAndPDialog: React.FC<ReportModalProps> = ({
  open,
  onClose,
  onSave,
  employees,
  orders,
  report,
  isEdit,
  isView,
}) => {
  const [reportName, setReportName] = useState<string>(report?.name ?? '')
  const [selectedEmployee, setSelectedEmployee] = useState<string>(
    report?.author?._id ?? ''
  )
  const [supplyDetails, setSupplyDetails] = useState<string>(
    report?.quality_details ?? ''
  )
  const [reportDate, setReportDate] = useState<Date | null>(
    report?.created_at ? new Date(report.created_at) : null
  )
  const [orderDate, setOrderDate] = useState<Date | null>(
    report?.order.created_at ? new Date(report.order.created_at) : null
  )
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(
    report?.order.received_date ? new Date(report.order.received_date) : null
  )
  const [estimatedDate, setEstimatedDate] = useState<Date | null>(
    report?.estimated_date ? new Date(report?.estimated_date) : null
  )
  const [rating, setRating] = useState<number>(report?.quality ?? 1)
  const [selectedOrder, setSelectedOrder] = useState<string>(
    report?.order._id ?? ''
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nameError, setNameError] = useState(false)
  const [detailsError, setDetailsError] = useState(false)
  const MAX_LENGTH = 500

  const selectedOrderData = orders.find((o) => o._id === selectedOrder)
  const supplies = selectedOrderData?.supplies || []
  const suppliesNames = supplies
    .map((supply) => supply.supplyId.name)
    .join(', ')

  useEffect(() => {
    if (selectedOrder) {
      setIsLoading(true)
      const order = orders.find((o) => o._id === selectedOrder)
      if (order) {
        const estimatedDate = new Date(order.created_at)
        estimatedDate.setDate(
          estimatedDate.getDate() + order.provider.estimated_delivery_time
        )
        setReportDate(new Date())
        setOrderDate(new Date(order.created_at))
        setDeliveryDate(new Date(order.received_date || new Date()))
        setEstimatedDate(estimatedDate)
      }
      setIsLoading(false)
    }
  }, [selectedOrder])

  const handleSave = () => {
    if (!reportName.trim()) {
      setNameError(true)
      return
    }
    setNameError(false)
    if (!supplyDetails.trim()) {
      setDetailsError(true)
      return
    }
    setDetailsError(false)

    const data: PostReportingOrder = {
      name: reportName,
      author: selectedEmployee,
      order: selectedOrder,
      quality_details: supplyDetails,
      quality: rating,
    }
    onSave(data)
  }

  const maxDate = new Date()

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Informe sobre pedido</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Seleccionar Pedido"
              select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isEdit}
              inputProps={{ readOnly: isView }}
              helperText="El pedido tiene que estar en estado completado y no tener un informe previo"
            >
              {orders.map((order) => (
                <MenuItem key={order._id} value={order._id}>
                  Pedido #{order.number} - {order.provider.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Nombre"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  disabled={!selectedOrder}
                  inputProps={{ readOnly: isView }}
                  required
                  error={nameError}
                  helperText={nameError ? 'El nombre es requerido' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Proveedor"
                  value={
                    selectedOrderData ? selectedOrderData.provider.name : ''
                  }
                  onChange={() => {}}
                  fullWidth
                  variant="outlined"
                  disabled={!selectedOrder}
                  inputProps={{ readOnly: true }}
                  helperText="El proveedor del pedido seleccionado"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Empleado que reporta"
                  select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  fullWidth
                  variant="outlined"
                  disabled={!selectedOrder}
                  inputProps={{ readOnly: isView }}
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee._id} value={employee._id}>
                      {employee.fullname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography component="legend">Calificación</Typography>
                  <Rating
                    name="quality-rating"
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue || 0)
                    }}
                    max={5}
                    size="large"
                    disabled={!selectedOrder || isView}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {rating} de 5 estrellas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observaciones"
                  value={supplyDetails}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_LENGTH) {
                      setSupplyDetails(e.target.value)
                      setDetailsError(false)
                    }
                  }}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  disabled={!selectedOrder}
                  inputProps={{
                    readOnly: isView,
                    maxLength: MAX_LENGTH,
                  }}
                  required
                  error={detailsError}
                  helperText={
                    detailsError
                      ? 'Las observaciones son requeridas'
                      : `${supplyDetails.length}/${MAX_LENGTH} caracteres`
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Insumos"
                  value={selectedOrderData ? suppliesNames : ''}
                  onChange={() => {}}
                  fullWidth
                  variant="outlined"
                  disabled={!selectedOrder}
                  inputProps={{ readOnly: true }}
                  helperText="Lista de insumos que se pidieron en el pedido"
                />
              </Grid>
              <Grid item xs={8}>
                <KeyboardDatePicker
                  label="Fecha en la que se hizo el pedido"
                  value={orderDate}
                  onChange={setOrderDate}
                  format="dd/MM/yyyy"
                  fullWidth
                  inputVariant="outlined"
                  disabled
                  helperText="Fecha en la que se hizo el pedido"
                />
              </Grid>
              <Grid item xs={8}>
                <KeyboardDatePicker
                  label="Fecha estimada de entrega"
                  value={estimatedDate}
                  onChange={setEstimatedDate}
                  format="dd/MM/yyyy"
                  fullWidth
                  inputVariant="outlined"
                  disabled
                  helperText="Fecha estimada de entrega del pedido"
                />
              </Grid>
              <Grid item xs={8}>
                <KeyboardDatePicker
                  label="Fecha de entrega"
                  value={deliveryDate}
                  onChange={setDeliveryDate}
                  format="dd/MM/yyyy"
                  fullWidth
                  inputVariant="outlined"
                  disabled
                  helperText="Fecha en la que se recibió el pedido"
                />
              </Grid>
              <Grid item xs={8}>
                <KeyboardDatePicker
                  label="Fecha de informe de reporte"
                  value={reportDate}
                  onChange={setReportDate}
                  format="dd/MM/yyyy"
                  fullWidth
                  inputVariant="outlined"
                  disabled
                  disableFuture
                  maxDate={maxDate}
                  helperText="Automaticamente se asigna la fecha de hoy"
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cerrar
        </Button>
        {!isView && (
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={!selectedOrder}
          >
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default QAndPDialog
