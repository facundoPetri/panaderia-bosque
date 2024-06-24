import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

interface StockItem {
  name: string;
  lastLoadDate: string;
  currentStock: string;
  description: string;
}


const columns: Column<StockItem>[] = [
  { id: 'name', label: 'Nombre' },
  { id: 'lastLoadDate', label: 'Fecha de ultima carga' },
  { id: 'currentStock', label: 'Stock actual' },
  { id: 'description', label: 'Descripción' },
];


const data: StockItem[] = [
  {
    name: "Azúcar blanca",
    lastLoadDate: "12/06/2022",
    currentStock: "20 kg",
    description: "Paquete de azúcar de 1kg c/u",
  },
  {
    name: "Harina 000",
    lastLoadDate: "20/06/2022",
    currentStock: "100 kg",
    description: "Paquete de 20kg c/u, de harina de trigo 000",
  },
  {
    name: "Huevo",
    lastLoadDate: "20/06/2022",
    currentStock: "46 unidades",
    description: "Maple de 30 huevos",
  },
  {
    name: "Levadura en polvo",
    lastLoadDate: "15/06/2022",
    currentStock: "10 unidades",
    description: "Paquete de 200gr c/u de levadura",
  },
  {
    name: "Margarina",
    lastLoadDate: "10/06/2022",
    currentStock: "15 kg",
    description: "Paquete de 5 kg c/u",
  },
  {
    name: "Sal fina",
    lastLoadDate: "22/06/2022",
    currentStock: "20 kg",
    description: "Paquetes de 5kg c/u de sal fina",
  }
];

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function Supplies() {
  const [selectedSupplies, setSelectedSupplies] = useState<StockItem | null>(null);
  //Modal
  const handleView = (supplies: StockItem) => {
    setSelectedSupplies(supplies);
  };

  const handleClose = () => {
    setSelectedSupplies(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de insumos</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
      />
    </div>
  );
}
