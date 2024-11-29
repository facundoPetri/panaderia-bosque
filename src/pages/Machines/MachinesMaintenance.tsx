import React, { useEffect, useState } from 'react'
import GenericTable, { Column } from '../../components/GenericTable'
import { request, requestToast } from '../../common/request'
import {
  convertToFullDateString,
  formatISODateString,
} from '../../utils/dateUtils'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import {
  Maintenance,
  TransformedMaintenance,
} from '../../interfaces/Maintenance'
import MachinesMaintenanceDialog from './MachinesMaintenanceDialog'
import { MachinesResponse } from '../../interfaces/Machines'
import MaintenanceDialogCreate from './MaintenanceDialogCreate'
import { API_BASE_URL } from '../../common/commonConsts'
import { toast, ToastContainer } from 'react-toastify'

const columns: Column<any>[] = [
  { id: '_id', label: 'id', hiddenColumn: true, sortable: false },
  { id: 'date', label: 'Fecha' },
  { id: 'machine', label: 'Maquinaria' },
  { id: 'user', label: 'Empleado' },
]

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function MachinesMaintenance() {
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<TransformedMaintenance | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [machines, setMachines] = useState<MachinesResponse[]>([])
  const [maintenances, setMaintenances] = useState<TransformedMaintenance[]>([])

  const onView = (item: TransformedMaintenance) => {
    setSelectedMaintenance(item)
    setIsEditMode(false)
  }

  const onClose = () => {
    setSelectedMaintenance(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const onDelete = async (id: string) => {
    try {
      const res = await request<any[]>({
        path: `/maintenance/${id}`,
        method: 'DELETE',
      })
      if (res) {
        getMaintenances()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onAdd = () => {
    setIsCreateMode(true)
  }

  const handleEdit = (item: TransformedMaintenance) => {
    setSelectedMaintenance(item)
    setIsEditMode(true)
  }

  const handleSave = async (machineMaintenance: any) => {
    const data = {
      description: machineMaintenance.description,
      date: convertToFullDateString(machineMaintenance.date),
    }

    try {
      const res = await request<any[]>({
        path: `/maintenance/${machineMaintenance._id}`,
        method: 'PATCH',
        data,
      })
      if (res) {
        getMaintenances()
      }
    } catch (error) {
      console.error(error)
    }
    setSelectedMaintenance(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const handleCreate = async (machineMaintenance: any) => {
    const data = {
      description: machineMaintenance.description,
      date: machineMaintenance.date,
      machine: machineMaintenance.machine,
    }

    try {
      const res = await request<any[]>({
        path: '/maintenance',
        method: 'POST',
        data,
      })
      if (res) {
        getMaintenances()
      }
    } catch (error) {
      console.error(error)
    }
    setIsCreateMode(false)
  }

  const transformUserData = (data: Maintenance[]): TransformedMaintenance[] => {
    return data.map((item) => ({
      ...item,
      machine: item.machine.name,
      user: item.user.fullname,
      date: formatISODateString(item.date),
    }))
  }

  const getMaintenances = async () => {
    try {
      const res = await request<Maintenance[]>({
        path: '/maintenance',
        method: 'GET',
      })
      if (res) {
        const transformedData = transformUserData(res)
        setMaintenances(transformedData)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getMachines = async () => {
    try {
      const res = await request<MachinesResponse[]>({
        path: '/machines',
        method: 'GET',
      })
      if (res) {
        setMachines(res)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {toast.promise(Promise.all([getMachines(), getMaintenances()]), {
    success: 'Maquinarias cargadas',
    error: 'Error al cargar maquinarias',
    pending: 'Cargando maquinarias...',
  })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión y mantenimiento de maquinaria</h1>
      <GenericTable
        columns={columns}
        data={maintenances}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        showDropdown={false}
        nameColumnId="_id"
      />
      <MaintenanceDialogCreate
        open={isCreateMode}
        onClose={onClose}
        onSave={handleCreate}
        machines={machines}
      />
      <MachinesMaintenanceDialog
        selectedMaintenance={selectedMaintenance}
        onClose={onClose}
        editable={isEditMode}
        onSave={handleSave}
      />
      <DownloadPdfButton url={`${API_BASE_URL}/maintenance/generate-pdf`} />
      <ToastContainer />
    </div>
  )
}
