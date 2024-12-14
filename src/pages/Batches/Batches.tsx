import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GenericTable, { Column } from '../../components/GenericTable'
import { Batch, BatchCreateData, FormattedBatch } from '../../interfaces/Batch'
import { SuppliesResponse } from '../../interfaces/Supplies'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import BatchesCreateDialog from './BatchesCreateDialog'
import BatchesEditDialog from './BatchesEditDialog'
import { formatISODateString } from '../../utils/dateUtils'
import { API_BASE_URL } from '../../common/commonConsts'
import { request, requestToast } from '../../common/request'
import { Typography } from '@material-ui/core'

const columns: Column<FormattedBatch>[] = [
  {
    id: '_id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  {
    id: 'batch_number',
    label: 'Lote',
  },
  {
    id: 'supply_id',
    label: 'Insumo',
  },
  {
    id: 'row',
    label: 'Fila',
  },
  {
    id: 'column',
    label: 'Columna',
  },
]
const dropdownOptions = columns
  .filter((column) => column.hiddenFilter !== true)
  .map((column) => ({
    title: column.label,
  }))
const Batches = () => {
  const [batches, setBatches] = useState<Batch[]>([])
  const [formatedBatches, setFormatedBatches] = useState<FormattedBatch[]>([])
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const getBatches = async () => {
    try {
      const res = await request<Batch[]>({
        path: '/batch',
        method: 'GET',
      })
      if (res) {
        const formattedBatches = res.map((batch) => ({
          ...batch,
          row: `Fila ${Number(batch.row)}`,
          column: `Columna ${Number(batch.column)}`,
          batch_number: `Lote número ${Number(batch.batch_number)}`,
          supply_id: batch.supply_id?.name || '',
          expiration_date: formatISODateString(batch.expiration_date),
          date_of_entry: formatISODateString(batch.date_of_entry),
        }))
        const isIncomplete = res.some((batch) => !batch.expiration_date)
        if (isIncomplete) {
          toast.warning('Hay lotes sin fecha de vencimiento', {
            autoClose: false,
          })
        }
        setBatches(res)
        setFormatedBatches(formattedBatches)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const onView = (batch: FormattedBatch) => {
    const newBatchToEdit = batches.find((b) => b._id === batch._id)
    if (newBatchToEdit) {
      setSelectedBatch(newBatchToEdit)
      setIsEditMode(false)
    }
  }
  const getSupplies = async () => {
    try {
      const res = await requestToast<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
        successMessage: 'Lotes cargados',
        errorMessage: 'Error al cargar lotes',
        pendingMessage: 'Cargando lotes...',
      })
      if (res) {
        setSupplies(res)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getSupplies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onClose = () => {
    setSelectedBatch(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const onDelete = async (id: string) => {
    try {
      const res = await requestToast<any[]>({
        path: `/batch/${id}`,
        method: 'DELETE',
        successMessage: 'Lote eliminado',
        errorMessage: 'Error al eliminar lote',
        pendingMessage: 'Eliminando lote...',
      })
      if (res) {
        getBatches()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onAdd = () => {
    setIsCreateMode(true)
  }
  useEffect(() => {
    if (supplies.length > 0) {
      getBatches()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplies])
  const handleEdit = (batch: any) => {
    const newBatchToEdit = batches.find((b) => b._id === batch._id)
    if (newBatchToEdit) {
      setSelectedBatch(newBatchToEdit)
      setIsEditMode(true)
    }
  }
  const handleCreate = async (batch: BatchCreateData) => {
    const data = {
      row: batch.row,
      column: batch.column,
      batch_number: batch.batch_number,
      date_of_entry: batch.date_of_entry,
      expiration_date: batch.expiration_date,
      quantity: batch.quantity,
      supply_id: batch.supply_id,
    }

    try {
      const res = await requestToast<any[]>({
        path: '/batch',
        method: 'POST',
        data,
        successMessage: 'Lote creado',
        errorMessage: 'Error al crear lote',
        pendingMessage: 'Creando lote...',
      })
      if (res) {
        getBatches()
      }
    } catch (error) {
      console.error(error)
    }
    setIsCreateMode(false)
  }
  const handleSave = async (batch: Batch) => {
    const data = {
      row: Number(batch.row),
      column: Number(batch.column),
      batch_number: Number(batch.batch_number),
      quantity: Number(batch.quantity),
      expiration_date: batch.expiration_date,
      date_of_entry: batch.date_of_entry,
      supply_id: batch.supply_id?._id,
    }

    try {
      const res = await requestToast<any[]>({
        path: `/batch/${batch._id}`,
        method: 'PATCH',
        data,
        successMessage: 'Lote actualizado',
        errorMessage: 'Error al actualizar lote',
        pendingMessage: 'Actualizando lote...',
      })
      if (res) {
        getBatches()
      }
    } catch (error) {
      console.error(error)
    }
    setSelectedBatch(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }
  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de lotes de insumos</h1>
      <Typography variant="body2" style={{ marginBottom: '16px' }}>
        En esta lista se muestran todos los lotes registrados. Para cada lote
        puedes:
        <ul>
          <li>
            Ver y editar la ubicación (fila y columna) del lote en el almacén
          </li>
          <li>Registrar o modificar la fecha de vencimiento</li>
          <li>Consultar el insumo, cantidad y fecha de ingreso</li>
        </ul>
      </Typography>
      <GenericTable
        columns={columns}
        data={formatedBatches}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onEdit={handleEdit}
        nameColumnId="batch_number"
      />
      {isCreateMode && (
        <BatchesCreateDialog
          open={isCreateMode}
          onClose={onClose}
          onSave={handleCreate}
          supplies={supplies}
        />
      )}
      <BatchesEditDialog
        open={Boolean(selectedBatch)}
        selectedBatch={selectedBatch}
        onClose={onClose}
        editable={isEditMode}
        onSave={handleSave}
        supplies={supplies}
      />
      <ToastContainer />
      {/* <DownloadPdfButton url={`${API_BASE_URL}/batch/generate-pdf`} /> */}
    </div>
  )
}

export default Batches
