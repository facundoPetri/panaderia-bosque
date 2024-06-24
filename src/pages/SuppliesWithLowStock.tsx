import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';


const columns: Column<Supply>[] = [
  { id: 'name', label: 'Nombre' },
  { id: 'currentStock', label: 'Stock actual' },
  { id: 'minimumStock', label: 'Stock minimo' },
  { id: 'maximumStock', label: 'Stock máximo' },
  { id: 'estimatedDeliveryTime', label: 'Tiempo de entrega' },
  { id: 'priority', label: 'Prioridad' },
];

interface Supply {
  name: string;
  currentStock: string;
  minimumStock: string;
  maximumStock: string;
  estimatedDeliveryTime: string;
  priority: 'Baja' | 'Media' | 'Alta';
}

const data: Supply[] = [
  {
    name: 'Azucar blanca',
    currentStock: '20 kg',
    minimumStock: '15 kg',
    maximumStock: '40 kg',
    estimatedDeliveryTime: '2 días',
    priority: 'Media',
  },
  {
    name: 'Harina 000',
    currentStock: '5 kg',
    minimumStock: '5 kg',
    maximumStock: '40 kg',
    estimatedDeliveryTime: '2 días',
    priority: 'Alta',
  },
  {
    name: 'Huevo',
    currentStock: '46 u',
    minimumStock: '10 u',
    maximumStock: '100 u',
    estimatedDeliveryTime: '1 día',
    priority: 'Baja',
  },
  {
    name: 'Levadura en polvo',
    currentStock: '10 u',
    minimumStock: '5 u',
    maximumStock: '20 u',
    estimatedDeliveryTime: '2 días',
    priority: 'Baja',
  },
  {
    name: 'Margarina',
    currentStock: '15 kg',
    minimumStock: '10 kg',
    maximumStock: '50 kg',
    estimatedDeliveryTime: '3 días',
    priority: 'Baja',
  },
  {
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de insumos con bajo stock</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
      />
    </div>
  );
}