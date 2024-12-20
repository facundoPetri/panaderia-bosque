import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GenericTable, { Column } from '../../components/GenericTable'
import MachineDialogEdit from './MachineDialogEdit'
import MachineDialogCreate from './MachineDialogCreate'
import {
  MachinesResponse,
  TransformedMachines,
  MaintenanceFilter,
} from '../../interfaces/Machines'
import { requestToast } from '../../common/request'
import { formatISODateString } from '../../utils/dateUtils'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import { getRequireMaintenance } from './helper'
import { API_BASE_URL } from '../../common/commonConsts'
import { Typography } from '@material-ui/core'
import {
  FilterSelect,
  maintainanceNeededOptions,
} from '../../components/FilterSelect'

const columns: Column<TransformedMachines>[] = [
  { id: '_id', label: 'id', hiddenColumn: true, sortable: false },
  { id: 'name', label: 'Nombre' },
  { id: 'purcharse_date', label: 'Fecha de adquisición' },
  { id: 'last_maintenance_date', label: 'Fecha del último mantenimiento' },
  { id: 'desired_maintenance', label: 'Mantenimiento deseado (en días)' },
  { id: 'require_maintenance', label: 'Requiere mantenimiento' },
]

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function Machines() {
  const [selectedMachineMaintenance, setSelectedMachineMaintenance] =
    useState<TransformedMachines | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [machines, setMachines] = useState<TransformedMachines[]>([])
  const userType = sessionStorage.getItem('userType')
  const [isMaintenanceNeeded, setIsMaintenanceNeeded] =
    useState<MaintenanceFilter>(MaintenanceFilter.ALL)

  const onView = (machineMaintenance: TransformedMachines) => {
    setSelectedMachineMaintenance(machineMaintenance)
    setIsEditMode(false)
  }

  const onClose = () => {
    setSelectedMachineMaintenance(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const onDelete = async (id: string) => {
    try {
      const res = await requestToast<any[]>({
        path: `/machines/${id}`,
        method: 'DELETE',
        successMessage: 'Maquinaria eliminada',
        errorMessage: 'Error al eliminar maquinaria',
        pendingMessage: 'Eliminando maquinaria...',
      })
      if (res) {
        getMachines()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onAdd = () => {
    setIsCreateMode(true)
  }

  const handleEdit = (machineToEdit: TransformedMachines) => {
    setSelectedMachineMaintenance(machineToEdit)
    setIsEditMode(true)
  }

  const handleSave = async (machineMaintenance: any) => {
    const data = {
      name: machineMaintenance.name,
      description: machineMaintenance.description,
      desired_maintenance: Number(machineMaintenance.desired_maintenance),
      purcharse_date: machineMaintenance.purchase_date,
    }

    try {
      const res = await requestToast<any[]>({
        path: `/machines/${machineMaintenance._id}`,
        method: 'PATCH',
        data,
        successMessage: 'Maquinaria actualizada',
        errorMessage: 'Error al actualizar maquinaria',
        pendingMessage: 'Actualizando maquinaria...',
      })
      if (res) {
        getMachines()
      }
    } catch (error) {
      console.error(error)
    }
    setSelectedMachineMaintenance(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const handleCreate = async (machineMaintenance: any) => {
    const data = {
      name: machineMaintenance.name,
      description: machineMaintenance.description,
      desired_maintenance: Number(machineMaintenance.desired_maintenance),
      purcharse_date: machineMaintenance.purcharse_date,
    }

    try {
      const res = await requestToast<any[]>({
        path: '/machines',
        method: 'POST',
        data,
        successMessage: 'Maquinaria creada',
        errorMessage: 'Error al crear maquinaria',
        pendingMessage: 'Creando maquinaria...',
      })
      if (res) {
        getMachines()
      }
    } catch (error) {
      console.error(error)
    }
    setIsCreateMode(false)
  }

  const transformUserData = (
    data: MachinesResponse[]
  ): TransformedMachines[] => {
    return data.map((machine) => ({
      ...machine,
      name: machine?.name ? machine.name : '',
      desired_maintenance: machine.desired_maintenance,
      purcharse_date: formatISODateString(machine.purcharse_date),
      last_maintenance_date: formatISODateString(machine.maintenance[0].date),
      require_maintenance: getRequireMaintenance(
        machine.require_maintenance || false
      ),
    }))
  }

  const getMachines = async (filterMaintenanceNeeded?: MaintenanceFilter) => {
    let path: string
    if (
      !filterMaintenanceNeeded ||
      filterMaintenanceNeeded === MaintenanceFilter.ALL
    ) {
      path = '/machines'
    } else {
      path = `/machines?require_maintenance=${filterMaintenanceNeeded}`
    }
    try {
      const res = await requestToast<MachinesResponse[]>({
        path,
        method: 'GET',
        successMessage: 'Maquinarias cargadas',
        errorMessage: 'Error al cargar maquinarias',
        pendingMessage: 'Cargando maquinarias...',
      })
      if (res) {
        const transformedData = transformUserData(res)
        setMachines(transformedData)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getMachines(isMaintenanceNeeded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaintenanceNeeded])
  return (
    <div style={{ padding: '20px' }}>
      <h1>Maquinarias y Utensilios</h1>
      <Typography style={{ marginBottom: 30 }}>
        Aquí podrás ver y administrar las maquinarias y Utensilios de tu
        panadería
      </Typography>
      <FilterSelect<MaintenanceFilter>
        value={isMaintenanceNeeded}
        onChange={setIsMaintenanceNeeded}
        options={maintainanceNeededOptions}
        title="¿Requiere mantenimiento?"
      />
      <GenericTable
        columns={columns}
        data={machines}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        showDropdown={false}
        nameColumnId="name"
        disableCreate={userType === 'user'}
        disableEdit={userType === 'user'}
      />
      <MachineDialogCreate
        open={isCreateMode}
        onClose={onClose}
        onSave={handleCreate}
      />
      <MachineDialogEdit
        machineMaintenance={selectedMachineMaintenance}
        onClose={onClose}
        editable={isEditMode}
        onSave={handleSave}
      />
      <ToastContainer />
      <DownloadPdfButton url={`${API_BASE_URL}/machines/generate-pdf`} />
    </div>
  )
}
