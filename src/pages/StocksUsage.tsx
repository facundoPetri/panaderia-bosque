import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

interface StockUsage {
  name: string;
  usageDate: string;
  quantity: string;
}

const columns: Column<StockUsage>[] = [
  { id: 'name', label: 'Nombre' },
  { id: 'usageDate', label: 'Fecha de Uso' },
  { id: 'quantity', label: 'Cantidad' },
];

const data: StockUsage[] = [
  {
    name: "Harina 000",
    usageDate: "10/11/2023",
    quantity: "35 kg",
  },
  {
    name: "Levadura en polvo",
    usageDate: "16/11/2023",
    quantity: "20 u",
  },
  {
    name: "Margarina",
    usageDate: "20/11/2023",
    quantity: "50 kg",
  },
  {
    name: "Azúcar blanca",
    usageDate: "20/11/2023",
    quantity: "40 kg",
  },
  {
    name: "Sal",
    usageDate: "28/11/2023",
    quantity: "40 kg",
  },
  {
    name: "Huevo",
    usageDate: "10/12/2023",
    quantity: "100 u",
  }
];

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function StocksUsage() {
  const [selectedStockUsage, setSelectedStockUsage] = useState<StockUsage | null>(null);

  const handleView = (stockUsage: StockUsage) => {
    setSelectedStockUsage(stockUsage);
  };

  const handleClose = () => {
    setSelectedStockUsage(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Registro de uso de insumos</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions}
        onView={handleView}
        showDropdown={false}
      />
    </div>
  );
}
