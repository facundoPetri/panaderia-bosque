import { useEffect, useState } from 'react'
import { request } from '../../common/request'
import GenericTable, { Column } from '../../components/GenericTable'
import { Batch, BatchCreateData, FormattedBatch } from '../../interfaces/Batch'
import { SuppliesResponse } from '../../interfaces/Supplies'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import BatchesCreateDialog from './BatchesCreateDialog'
import BatchesEditDialog from './BatchesEditDialog'
import { formatISODateString } from '../../utils/dateUtils'

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
    id: 'row',
    label: 'Fila',
  },
  {
    id: 'column',
    label: 'Columna',
  },
  {
    id: 'supply_id',
    label: 'Insumo',
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
          supply_id: batch.supply_id?.name || '',
          expiration_date: formatISODateString(batch.expiration_date),
          date_of_entry: formatISODateString(batch.date_of_entry),
        }))
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
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
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
      const res = await request<any[]>({
        path: `/batch/${id}`,
        method: 'DELETE',
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
      const res = await request<any[]>({
        path: '/batch',
        method: 'POST',
        data,
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
      const res = await request<any[]>({
        path: `/batch/${batch._id}`,
        method: 'PATCH',
        data,
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
      <GenericTable
        columns={columns}
        data={formatedBatches}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        nameColumnId="_id"
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
        selectedBatch={selectedBatch}
        onClose={onClose}
        editable={isEditMode}
        onSave={handleSave}
        supplies={supplies}
      />
      <DownloadPdfButton url="http://localhost:3000/batch/generate-pdf" />
    </div>
  )
}

export default Batches
