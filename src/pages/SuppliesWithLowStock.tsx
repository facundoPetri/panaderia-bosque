import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';


const columns: Column<Supply>[] = [
  { id: 'id', label: 'id' , hidden: true, sortable : false},
  { id: 'name', label: 'Nombre' },
  { id: 'currentStock', label: 'Stock actual' },
  { id: 'minimumStock', label: 'Stock minimo' },
  { id: 'maximumStock', label: 'Stock máximo' },
  { id: 'estimatedDeliveryTime', label: 'Tiempo de entrega' },
  { id: 'priority', label: 'Prioridad' },
];

interface Supply {
  id: string;
  name: string;
  currentStock: string;
  minimumStock: string;
  maximumStock: string;
  estimatedDeliveryTime: string;
  priority: 'Baja' | 'Media' | 'Alta';
}

const data: Supply[] = [
  {
    id: '1',
    name: 'Azucar blanca',
    currentStock: '20 kg',
    minimumStock: '15 kg',
    maximumStock: '40 kg',
    estimatedDeliveryTime: '2 días',
    priority: 'Media',
  },
  {
    id: '2',
    name: 'Harina 000',
    currentStock: '5 kg',
    minimumStock: '5 kg',
    maximumStock: '40 kg',
    estimatedDeliveryTime: '2 días',
    priority: 'Alta',
  },
  {
    id: '3',
    name: 'Huevo',
    currentStock: '46 u',
    minimumStock: '10 u',
    maximumStock: '100 u',
    estimatedDeliveryTime: '1 día',
    priority: 'Baja',
  },
  {
    id: '4',
    name: 'Levadura en polvo',
    currentStock: '10 u',
    minimumStock: '5 u',
    maximumStock: '20 u',
    estimatedDeliveryTime: '2 días',
    priority: 'Baja',
  },
  {
    id: '5',
    name: 'Margarina',
    currentStock: '15 kg',
    minimumStock: '10 kg',
    maximumStock: '50 kg',
    estimatedDeliveryTime: '3 días',
    priority: 'Baja',
  },
  {
    id: '6',
    name: 'Sal fina',
    currentStock: '20 kg',
    minimumStock: '10 kg',
    maximumStock: '40 kg',
    estimatedDeliveryTime: '1 día',
    priority: 'Baja',
  },
];

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function SuppliesWithLowStock() {
  const [selectedSupplies, setSelectedSupplies] = useState<Supply | null>(null);
  //Modal
  const handleView = (supplies: Supply) => {
    setSelectedSupplies(supplies);
  };

  const handleClose = () => {
    setSelectedSupplies(null);
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
      <h1>Consulta de insumos con bajo stock</h1>
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