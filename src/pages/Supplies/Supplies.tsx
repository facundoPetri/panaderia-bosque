import React, { useState, useEffect } from 'react'
import GenericTable, { Column } from '../../components/GenericTable'
import SuppliesDialogEdit from './SuppliesDialogEdit'
import SuppliesDialogCreate from './SuppliesDialogCreate'
import { request } from '../../common/request'
import { SuppliesCreateData, SuppliesResponse } from '../../interfaces/Supplies'

const columns: Column<SuppliesResponse>[] = [
  {
    id: '_id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'name', label: 'Nombre' },
  { id: 'updatedAt', label: 'Fecha de última carga', hiddenFilter: true },
  { id: 'description', label: 'Descripción', hiddenFilter: true },
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
      const res = await request<any[]>({
        path: `/supplies/${id}`,
        method: 'DELETE',
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
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
      })
      if (res) {
        console.log(res)
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
      const res = await request<any[]>({
        path: `/supplies/${supplies._id}`,
        method: 'PUT',
        data,
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
      const res = await request<any[]>({
        path: '/supplies',
        method: 'POST',
        data,
      })
      if (res) {
        getSupplies()
      }
    } catch (error) {
      console.error(error)
    }
    setIsCreateMode(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de insumos</h1>
      <GenericTable
        columns={columns}
        data={supplies} //TODO: reemplazar fake data por supplies
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        nameColumnId="name"
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
    </div>
  )
}
