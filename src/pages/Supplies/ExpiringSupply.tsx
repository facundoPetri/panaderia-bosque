import { useEffect, useState } from 'react'
import GenericTable, { Column } from '../../components/GenericTable'
import { SuppliesResponse, TransformedBatch } from '../../interfaces/Supplies'
import { requestToast } from '../../common/request'
import { formatISODateString } from '../../utils/dateUtils'
import SuppliesDialogEdit from './SuppliesDialogEdit'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import { API_BASE_URL } from '../../common/commonConsts'
import { ToastContainer } from 'react-toastify'
import { Batch as BatchResponse } from '../../interfaces/Batch'
import { FilterDaysSelect } from '../../components/FilterDaysSelect'

const columns: Column<TransformedBatch>[] = [
  {
    id: '_id',
    label: 'ID',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'expiration_date', label: 'Fecha de vencimiento', sortable: true },
  { id: 'supply_name', label: 'Nombre del insumo', sortable: true },
  { id: 'batch_number', label: 'Número de lote' },
  { id: 'location', label: 'Ubicación' },
  { id: 'quantity', label: 'Cantidad', sortable: true },
]

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function ExpiringSupply() {
  const [selectedBatches, setSelectedBatches] = useState<BatchResponse[]>([])
  const [selectedSupply, setSelectedSupply] = useState<SuppliesResponse | null>(
    null
  )
  const [batches, setBatches] = useState<TransformedBatch[]>([])
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [filterDays, setFilterDays] = useState<number>(30)

  const onView = (batch: TransformedBatch) => {
    const originalBatch = selectedBatches.find((b) => b._id === batch._id)
    setIsEditMode(false)

    setSelectedSupply(originalBatch?.supply_id || null)
  }

  const onClose = () => {
    setSelectedSupply(null)
    setIsEditMode(false)
  }

  const getBatches = async () => {
    try {
      const res = await requestToast<BatchResponse[]>({
        path: '/batch?expiring=true&days=' + filterDays,
        method: 'GET',
        successMessage: 'Insumos  cargados',
        errorMessage: 'Error al cargar insumos',
        pendingMessage: 'Cargando insumos...',
      })
      if (res) {
        setSelectedBatches(res)
        const transformedBatches = res.map((batch) => ({
          ...batch,
          expiration_date: formatISODateString(batch.expiration_date),
          supply_name: batch.supply_id?.name ?? 'Sin nombre',
          location: `Fila ${batch.row}, Columna ${batch.column}`,
          quantity: `${batch.quantity} ${batch.supply_id?.unit}`,
        }))
        setBatches(transformedBatches)
      }
    } catch (error) {
      console.error('Error al obtener los insumos:', error)
    }
  }

  useEffect(() => {
    getBatches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDays])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Insumos con vencimiento próximo</h1>
      <FilterDaysSelect
        title="Lotes que vencen en los próximos:"
        value={filterDays}
        onChange={setFilterDays}
      />
      <GenericTable
        columns={columns}
        data={batches}
        dropdownOptions={dropdownOptions}
        onView={onView}
        showDropdown={false}
        nameColumnId="batch_number"
      />
      {selectedSupply && (
        <SuppliesDialogEdit
          selectedSupplies={selectedSupply}
          onClose={onClose}
          editable={isEditMode}
        />
      )}
      <ToastContainer />
      <DownloadPdfButton url={`${API_BASE_URL}/batch/generate-pdf`} />
    </div>
  )
}
