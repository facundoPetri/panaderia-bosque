import { useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';

interface StockUsage {
  id: string;
  name: string;
  usageDate: string;
  quantity: string;
}

const columns: Column<StockUsage>[] = [
  { id: 'id', label: 'id' , hiddenColumn: true, sortable : false},
  { id: 'name', label: 'Nombre' },
  { id: 'usageDate', label: 'Fecha de Uso' },
  { id: 'quantity', label: 'Cantidad' },
];

const data: StockUsage[] = [
  {
    id: '1',
    name: "Harina 000",
    usageDate: "10/11/2023",
    quantity: "35 kg",
  },
  {
    id: '2',
    name: "Levadura en polvo",
    usageDate: "16/11/2023",
    quantity: "20 u",
  },
  {
    id: '3',
    name: "Margarina",
    usageDate: "20/11/2023",
    quantity: "50 kg",
  },
  {
    id: '4',
    name: "Azúcar blanca",
    usageDate: "20/11/2023",
    quantity: "40 kg",
  },
  {
    id: '5',
    name: "Sal",
    usageDate: "28/11/2023",
    quantity: "40 kg",
  },
  {
    id: '6',
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

  const onView = (stockUsage: StockUsage) => {
    setSelectedStockUsage(stockUsage);
  };

  const onClose = () => {
    setSelectedStockUsage(null);
  };

  const onDelete = (id: number) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const onAdd = () => {
    console.log('Agregando nuevo elemento');
    // Aquí puedes manejar la lógica de agregar un nuevo elemento
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Registro de uso de insumos</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        showDropdown={false}
        nameColumnId="name"
      />
    </div>
  );
}
