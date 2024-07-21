import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import UserDialogCreate from './UserDialogCreate';
import UserDialogEdit from './UserDialogEdit';
import { TransformedUser, UsersResponse } from '../../interfaces/Users';
import { request } from '../../common/request';
import { formatDate } from '../../utils/dateUtils';
import { Button } from '@material-ui/core';
import { downloadPdf } from '../../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const columns: Column<TransformedUser>[] = [
  { id: '_id', label: 'id', hiddenColumn: true, sortable: false, hiddenFilter: true },
  { id: 'fullname', label: 'Nombre Completo' },
  { id: 'email', label: 'Email', hiddenFilter: true },
  { id: 'state', label: 'Estado' },
  { id: 'type', label: 'Tipo' },
  { id: 'createdAt', label: 'Fecha Creacion', hiddenFilter: true },
  { id: 'lastSession', label: 'Ultimo Inicio', hiddenFilter: true },
];

const dropdownOptions = columns
  .filter(column => column.hiddenFilter !== true)
  .map(column => ({
    title: column.label,
  }));

export default function Userstable() {
  const [selectedUser, setSelectedUser] = useState<TransformedUser | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [users, setUsers] = useState<TransformedUser[]>([]);

  const onView = (user: TransformedUser) => {
    setSelectedUser(user);
    setIsEditMode(false);
  };

  const onClose = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const onDelete = (id: string) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const onAdd = () => {
    setIsCreateMode(true);
  };

  const handleEdit = (user: TransformedUser) => {
    setSelectedUser(user);
    setIsEditMode(true);
  };

  const handleSave = (user: TransformedUser) => {
    console.log('Guardando cambios', user);
    // Aquí puedes manejar la lógica para guardar los cambios del usuario
    setSelectedUser(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const handleCreate = (user: any) => {
    console.log('Creando usuario', user);
    // Aquí puedes manejar la lógica para crear un nuevo usuario
    setIsCreateMode(false);
  };

  const transformUserData = (data: UsersResponse[]): TransformedUser[] => {
    return data.map(user => ({
      ...user,
      fullname: user?.fullname ? user.fullname : '',
      state: user.state ? 'Activo' : 'Inactivo',
      type: user?.type ? user.type : '',
      createdAt: formatDate(user.createdAt),
      lastSession: user?.lastSession ? new Date(user?.lastSession).toLocaleDateString() : '',
    }));
  };

  const getUsers = async () => {
    try {
      const res = await request<UsersResponse[]>({
        path: '/users',
        method: 'GET',
      });
      if (res) {
        const transformedData = transformUserData(res);
        setUsers(transformedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <UserDialogCreate open={isCreateMode} onClose={onClose} onSave={handleCreate} />
      <UserDialogEdit user={selectedUser} onClose={onClose} editable={isEditMode} onSave={handleSave} />
      <Button onClick={() => downloadPdf("http://localhost:3000/users/generate-pdf")}>
        <FontAwesomeIcon icon={faFilePdf} size='2x'/> 
      </Button>
    </div>
  );
}
