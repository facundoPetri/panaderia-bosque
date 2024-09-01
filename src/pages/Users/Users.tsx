import { useEffect, useState } from 'react'
import GenericTable from '../../components/GenericTable'
import { Column } from '../../components/GenericTable'
import UserDialogCreate from './UserDialogCreate'
import UserDialogEdit from './UserDialogEdit'
import { TransformedUser, UsersResponse } from '../../interfaces/Users'
import { request } from '../../common/request'
import { formatISODateString } from '../../utils/dateUtils'
import DownloadPdfButton from '../../components/DownloadPdfButton'

const columns: Column<TransformedUser>[] = [
  {
    id: '_id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'fullname', label: 'Nombre Completo' },
  { id: 'email', label: 'Email', hiddenFilter: true },
  { id: 'state', label: 'Estado' },
  { id: 'type', label: 'Tipo' },
  { id: 'createdAt', label: 'Fecha Creacion', hiddenFilter: true },
  { id: 'lastSession', label: 'Ultimo Inicio', hiddenFilter: true },
]

const dropdownOptions = columns
  .filter((column) => column.hiddenFilter !== true)
  .map((column) => ({
    title: column.label,
  }))

export default function Userstable() {
  const [selectedUser, setSelectedUser] = useState<TransformedUser | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [users, setUsers] = useState<TransformedUser[]>([])

  const onView = (user: TransformedUser) => {
    setSelectedUser(user)
    setIsEditMode(false)
  }

  const onClose = () => {
    setSelectedUser(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const onDelete = async (id: string) => {
    try {
      const res = await request<any[]>({
        path: `/users/${id}`,
        method: 'DELETE',
      })
      if (res) {
        getUsers()
      }
    } catch (error) {
      console.error(error)
    }
    // Aquí puedes llamar a tu servicio de eliminación con el id
  }

  const onAdd = () => {
    setIsCreateMode(true)
  }

  const handleEdit = (user: TransformedUser) => {
    setSelectedUser(user)
    setIsEditMode(true)
  }

  const handleSave = async (user: TransformedUser) => {
    try {
      const res = await request<UsersResponse[]>({
        path: `/users/${user._id}`,
        method: 'PATCH',
        data: {
          fullname: user.fullname,
          email: user.email,
          pasword: user.password,
          type: user.type,
        },
      })
      if (res) {
        getUsers()
      }
    } catch (error) {
      console.error(error)
    }
    setSelectedUser(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const handleCreate = async (user: any) => {
    try {
      const res = await request<UsersResponse[]>({
        path: '/users',
        method: 'POST',
        data: user,
      })
      if (res) {
        getUsers()
      }
    } catch (error) {
      console.error(error)
    }
    // Aquí puedes manejar la lógica para crear un nuevo usuario
    setIsCreateMode(false)
  }

  const transformUserData = (data: UsersResponse[]): TransformedUser[] => {
    return data.map((user) => ({
      ...user,
      fullname: user?.fullname ? user.fullname : '',
      state: user.state ? 'Activo' : 'Inactivo',
      type: user?.type ? user.type : '',
      createdAt: formatISODateString(user.createdAt),
      lastSession: user?.lastSession
        ? new Date(user?.lastSession).toLocaleDateString()
        : '',
    }))
  }

  const getUsers = async () => {
    try {
      const res = await request<UsersResponse[]>({
        path: '/users',
        method: 'GET',
      })
      if (res) {
        const transformedData = transformUserData(res)
        setUsers(transformedData)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consultar usuarios</h1>
      <GenericTable
        columns={columns}
        data={users}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        nameColumnId="fullname"
      />
      <UserDialogCreate
        open={isCreateMode}
        onClose={onClose}
        onSave={handleCreate}
      />
      <UserDialogEdit
        user={selectedUser}
        onClose={onClose}
        editable={isEditMode}
        onSave={handleSave}
      />
      <DownloadPdfButton url="http://localhost:3000/users/generate-pdf" />
    </div>
  )
}
