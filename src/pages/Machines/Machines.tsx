import React, { useEffect, useState } from 'react'
import GenericTable, { Column } from '../../components/GenericTable'
import MachineDialogEdit from './MachineDialogEdit'
import MachineDialogCreate from './MachineDialogCreate'
import {
  MachinesResponse,
  TransformedMachines,
} from '../../interfaces/Machines'
import { request } from '../../common/request'
import { formatISODateString } from '../../utils/dateUtils'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import { getRequireMaintenance } from './helper'

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
      const res = await request<any[]>({
        path: `/machines/${id}`,
        method: 'DELETE',
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
      const res = await request<any[]>({
        path: `/machines/${machineMaintenance._id}`,
        method: 'PATCH',
        data,
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
      const res = await request<any[]>({
        path: '/machines',
        method: 'POST',
        data,
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

  const getMachines = async () => {
    try {
      const res = await request<MachinesResponse[]>({
        path: '/machines',
        method: 'GET',
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
    getMachines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div style={{ padding: '20px' }}>
      <h1>Consultar Maquinarias</h1>
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
      <DownloadPdfButton url="http://localhost:3000/machines/generate-pdf" />
    </div>
  )
}
