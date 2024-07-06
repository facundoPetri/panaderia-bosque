import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

const columns: Column<Order>[] = [
  { id: 'id', label: 'id' , hidden: true, sortable : false},
  { id: 'orderNumber', label: 'Numero de perido' },
  { id: 'creationDate', label: 'Fecha de creacion' , sortable: false},
  { id: 'Provider', label: 'Proveedor' },
  { id: 'supplies', label: 'Insumos' },
];

// Define the Order interface
interface Order {
  id: string;
  orderNumber: number;
  creationDate: string;
  Provider: string;
  supplies: string;
}
  
  // Constants with the extracted values
  const data: Order[] = [
    {
      id: '1',
      orderNumber: 1,
      creationDate: '01/06/2022',
      Provider: 'Merentiel S.A',
      supplies: 'Harina, azúcar, levadura',
    },
    {
      id: '2',
      orderNumber: 2,
      creationDate: '03/06/2022',
      Provider: 'Ramirez y Hnos. S.R.L',
      supplies: 'Harina, levadura',
    },
    {
      id: '3',
      orderNumber: 3,
      creationDate: '06/06/2022',
      Provider: 'Bimbo',
      supplies: 'Harina, levadura',
    },
    {
      id: '4',
      orderNumber: 4,
      creationDate: '12/06/2022',
      Provider: 'Mapricoa',
      supplies: 'Manteca, crema',
    },
    {
      id: '5',
      orderNumber: 5,
      creationDate: '15/06/2022',
      Provider: 'Ledevit',
      supplies: 'Manteca, crema',
    },
    {
      id: '6',
      orderNumber: 6,
      creationDate: '20/06/2022',
      Provider: 'Ledesma',
      supplies: 'Huevos',
    },
  ];  

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function OrdersProviders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//Modal
  const handleView = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleClose = () => {
    setSelectedOrder(null);
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
      <h1>Pedidos a proveedores</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
        onDelete={handleDelete}
        onAdd={handleAdd}
        nameColumnId="orderNumber"
      />
    </div>
  );
}