import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';
  
  const columns: Column<ExpiringSupplyI>[] = [
    { id: 'expirationDate', label: 'Fecha de vencimiento' },
    { id: 'name', label: 'Nombre' },
    { id: 'batchNumber', label: 'Numero de lote' },
    { id: 'location', label: 'Ubicacion' },
    { id: 'quantity', label: 'Cantidad' },
  ];

interface ExpiringSupplyI {
    expirationDate: string;
    name: string;
    batchNumber: number;
    location: string;
    quantity: string;
  }

  const data: ExpiringSupplyI[] = [
    {
      expirationDate: '20/11/2023',
      name: 'Azucar blanca',
      batchNumber: 15,
      location: 'Fila 1 columna 2',
      quantity: '35 kg',
    },
    {
      expirationDate: '21/11/2023',
      name: 'Harina 000',
      batchNumber: 3,
      location: 'Fila 3 columna 1',
      quantity: '35 kg',
    },
    {
      expirationDate: '10/12/2023',
      name: 'Huevo',
      batchNumber: 3,
      location: 'Fila 1 columna 1',
      quantity: '100 u',
    },
    {
      expirationDate: '16/12/2023',
      name: 'Levadura en polvo',
      batchNumber: 5,
      location: 'Fila 2 columna 1',
      quantity: '20 u',
    },
    {
      expirationDate: '20/12/2023',
      name: 'Margarina',
      batchNumber: 10,
      location: 'Fila 3 columna 3',
      quantity: '50 kg',
    },
    {
      expirationDate: '28/12/2023',
      name: 'Sal',
      batchNumber: 10,
      location: 'Fila 2 columna 2',
      quantity: '40 kg',
    },
  ];  

  const dropdownOptions = columns.map(column => ({
    title: column.label,
  }));
  
  export default function ExpiringSupply() {
    const [selectedSupplies, setSelectedSupplies] = useState<ExpiringSupplyI | null>(null);
  //Modal
    const handleView = (expiringSupply: ExpiringSupplyI) => {
        setSelectedSupplies(expiringSupply);
    };
  
    const handleClose = () => {
        setSelectedSupplies(null);
    };
  
    return (
      <div style={{ padding: '20px' }}>
        <h1>Insumos con vencimiento próximo</h1>
        <GenericTable
          columns={columns}
          data={data}
          dropdownOptions={dropdownOptions} // Agrege dropdownOptions
          onView={handleView}
          showDropdown={false}
        />
      </div>
    );
  }