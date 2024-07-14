// src/pages/Users/index.tsx
import { useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import UserDialogCreate from './UserDialogCreate';
import UserDialogEdit from './UserDialogEdit';

export interface User {
  id: string;
  fullName: string;
  email: string;
  status: 'Active' | 'Inactive';
  role: 'Employee' | 'Administrator' | 'Master Baker';
  creationDate: string;
  lastLogin: string;
}

const columns: Column<User>[] = [
  { id: 'id', label: 'id', hiddenColumn: true, sortable: false, hiddenFilter: true },
  { id: 'fullName', label: 'Nombre Completo' },
  { id: 'email', label: 'Email', hiddenFilter: true },
  { id: 'status', label: 'Estado' },
  { id: 'role', label: 'Tipo' },
  { id: 'creationDate', label: 'Fecha Creacion', hiddenFilter: true },
  { id: 'lastLogin', label: 'Ultimo Inicio', hiddenFilter: true },
];

const users: User[] = [
  {
    id: '1',
    fullName: 'Esteban Rolón',
    email: 'ERolon@panaderiadelbosque.com',
    status: 'Active',
    role: 'Employee',
    creationDate: '13/06/2022',
    lastLogin: '16/06/2022',
  },
  {
    id: '2',
    fullName: 'Federico Bravo',
    email: 'FBravo@panaderiadelbosque.com',
    status: 'Active',
    role: 'Employee',
    creationDate: '17/06/2022',
    lastLogin: '23/06/2022',
  },
  {
    id: '3',
    fullName: 'Hernán Santos',
    email: 'HSantos@panaderiadelbosque.com',
    status: 'Inactive',
    role: 'Employee',
    creationDate: '13/06/2022',
    lastLogin: '19/06/2022',
  },
  {
    id: '4',
    fullName: 'Juan Medina',
    email: 'JMedina@panaderiadelbosque.com',
    status: 'Active',
    role: 'Administrator',
    creationDate: '18/06/2022',
    lastLogin: '28/06/2022',
  },
  {
    id: '5',
    fullName: 'Juan Román Riquelme',
    email: 'JRiquelme@panaderiadelbosque.com',
    status: 'Inactive',
    role: 'Master Baker',
    creationDate: '10/06/2022',
    lastLogin: '30/06/2022',
  },
  {
    id: '6',
    fullName: 'Rocío Gutierrez',
    email: 'RGutierrez@panaderiadelbosque.com',
    status: 'Active',
    role: 'Administrator',
    creationDate: '10/06/2022',
    lastLogin: '12/06/2022',
  },
];

const dropdownOptions = columns
  .filter(column => column.hiddenFilter !== true)
  .map(column => ({
    title: column.label,
  }));

export default function Users() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);

  const onView = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(false);
  };

  const onClose = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const onDelete = (id: number) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const onAdd = () => {
    setIsCreateMode(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
  };

  const handleSave = (user: User) => {
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
        nameColumnId="fullName"
      />
      <UserDialogCreate open={isCreateMode} onClose={onClose} onSave={handleCreate} />
      <UserDialogEdit user={selectedUser} onClose={onClose} editable={isEditMode} onSave={handleSave} />
    </div>
  );
}
