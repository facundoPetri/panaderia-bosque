import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

const columns: Column<Provider>[] = [
  { id: 'name', label: 'Nombre' },
  { id: 'phone', label: 'Telefono' , sortable: false},
  { id: 'email', label: 'Email' },
  { id: 'supplies', label: 'Insumos' },
];

interface Provider {
    name: string;
    phone: string;
    email: string;
    supplies: string;
  }
  
  const data: Provider[] = [
    {
      name: 'Bimbo',
      phone: '3514789635',
      email: 'bimbo@gmail.com',
      supplies: 'Harina, levadura',
    },
    {
      name: 'Ledevit',
      phone: '3513969578',
      email: 'ledevit@gmail.com',
      supplies: 'Manteca, crema',
    },
    {
      name: 'Ledesma',
      phone: '3513669978',
      email: 'ledesma@gmail.com',
      supplies: 'Huevos',
    },
    {
      name: 'Mapricoa',
      phone: '3514259635',
      email: 'mapricoa@gmail.com',
      supplies: 'Manteca, crema',
    },
    {
      name: 'Merentiel S.A',
      phone: '3513669578',
      email: 'merentielsa@gmail.com',
      supplies: 'Harina, azúcar, levadura',
    },
    {
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Listado de proveedores</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
      />
    </div>
  );
}