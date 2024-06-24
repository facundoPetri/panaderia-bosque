import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

interface User {
    fullName: string;
    email: string;
    status: 'Active' | 'Inactive';
    role: 'Employee' | 'Administrator' | 'Master Baker';
    creationDate: string;
    lastLogin: string;
  }
  
  const columns: Column<User>[] = [
    { id: 'fullName', label: 'Nombre Completo' },
    { id: 'email', label: 'Email' },
    { id: 'status', label: 'Estado' },
    { id: 'role', label: 'Tipo' },
    { id: 'creationDate', label: 'Fecha Creacion' },
    { id: 'lastLogin', label: 'Ultimo Inicio' },
  ];
  
  const users: User[] = [
    {
      fullName: 'Esteban Rolón',
      email: 'ERolon@panaderiadelbosque.com',
      status: 'Active',
      role: 'Employee',
      creationDate: '13/06/2022',
      lastLogin: '16/06/2022',
    },
    {
      fullName: 'Federico Bravo',
      email: 'FBravo@panaderiadelbosque.com',
      status: 'Active',
      role: 'Employee',
      creationDate: '17/06/2022',
      lastLogin: '23/06/2022',
    },
    {
      fullName: 'Hernán Santos',
      email: 'HSantos@panaderiadelbosque.com',
      status: 'Inactive',
      role: 'Employee',
      creationDate: '13/06/2022',
      lastLogin: '19/06/2022',
    },
    {
      fullName: 'Juan Medina',
      email: 'JMedina@panaderiadelbosque.com',
      status: 'Active',
      role: 'Administrator',
      creationDate: '18/06/2022',
      lastLogin: '28/06/2022',
    },
    {
      fullName: 'Juan Román Riquelme',
      email: 'JRiquelme@panaderiadelbosque.com',
      status: 'Inactive',
      role: 'Master Baker',
      creationDate: '10/06/2022',
      lastLogin: '30/06/2022',
    },
    {
      fullName: 'Rocío Gutierrez',
      email: 'RGutierrez@panaderiadelbosque.com',
      status: 'Active',
      role: 'Administrator',
      creationDate: '10/06/2022',
      lastLogin: '12/06/2022',
    },
  ];

  const dropdownOptions = columns.map(column => ({
    title: column.label,
  }));
  
  export default function Users() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
  //Modal
    const handleView = (user: User) => {
        setSelectedUser(user);
    };
  
    const handleClose = () => {
        setSelectedUser(null);
    };
  
    return (
      <div style={{ padding: '20px' }}>
        <h1>Consultar usuarios</h1>
        <GenericTable
          columns={columns}
          data={users}
          dropdownOptions={dropdownOptions} // Agrege dropdownOptions
          onView={handleView}
        />
      </div>
    );
  }