import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

const columns: Column<Provider>[] = [
  { id: 'id', label: 'id' , hidden: true, sortable : false},
  { id: 'name', label: 'Nombre' },
  { id: 'phone', label: 'Telefono' , sortable: false},
  { id: 'email', label: 'Email' },
  { id: 'supplies', label: 'Insumos' },
];

interface Provider {
  id: string;
  name: string;
  phone: string;
  email: string;
  supplies: string;
}
  
  const data: Provider[] = [
    {
      id: '1',
      name: 'Bimbo',
      phone: '3514789635',
      email: 'bimbo@gmail.com',
      supplies: 'Harina, levadura',
    },
    {
      id: '2',
      name: 'Ledevit',
      phone: '3513969578',
      email: 'ledevit@gmail.com',
      supplies: 'Manteca, crema',
    },
    {
      id: '3',
      name: 'Ledesma',
      phone: '3513669978',
      email: 'ledesma@gmail.com',
      supplies: 'Huevos',
    },
    {
      id: '4',
      name: 'Mapricoa',
      phone: '3514259635',
      email: 'mapricoa@gmail.com',
      supplies: 'Manteca, crema',
    },
    {
      id: '5',
      name: 'Merentiel S.A',
      phone: '3513669578',
      email: 'merentielsa@gmail.com',
      supplies: 'Harina, azúcar, levadura',
    },
    {
      id: '6',
      name: 'Ramirez y Hnos. S.R.L',
      phone: '3514589963',
      email: 'ramirezsrl@gmail.com',
      supplies: 'Harina, levadura',
    },
  ];


const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function Providers() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
//Modal
  const handleView = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const handleClose = () => {
    setSelectedProvider(null);
  };

  const handleDelete = (id: number) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const handleAdd = () => {
    console.log('Agregando nuevo elemento');
    // Aquí puedes manejar la lógica de agregar un nuevo elemento
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Listado de proveedores</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
        onDelete={handleDelete}
        onAdd={handleAdd}
        nameColumnId="name"
      />
    </div>
  );
}