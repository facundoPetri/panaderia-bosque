import { useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
  
  const columns: Column<ExpiringSupplyI>[] = [
    { id: 'id', label: 'id' , hiddenColumn: true, sortable : false},
    { id: 'expirationDate', label: 'Fecha de vencimiento' },
    { id: 'name', label: 'Nombre' },
    { id: 'batchNumber', label: 'Numero de lote' },
    { id: 'location', label: 'Ubicacion' },
    { id: 'quantity', label: 'Cantidad' },
  ];

interface ExpiringSupplyI {
  id: string;
  expirationDate: string;
  name: string;
  batchNumber: number;
  location: string;
  quantity: string;
}

  const data: ExpiringSupplyI[] = [
    {
      id: '1',
      expirationDate: '20/11/2023',
      name: 'Azucar blanca',
      batchNumber: 15,
      location: 'Fila 1 columna 2',
      quantity: '35 kg',
    },
    {
      id: '2',
      expirationDate: '21/11/2023',
      name: 'Harina 000',
      batchNumber: 3,
      location: 'Fila 3 columna 1',
      quantity: '35 kg',
    },
    {
      id: '3',
      expirationDate: '10/12/2023',
      name: 'Huevo',
      batchNumber: 3,
      location: 'Fila 1 columna 1',
      quantity: '100 u',
    },
    {
      id: '4',
      expirationDate: '16/12/2023',
      name: 'Levadura en polvo',
      batchNumber: 5,
      location: 'Fila 2 columna 1',
      quantity: '20 u',
    },
    {
      id: '5',
      expirationDate: '20/12/2023',
      name: 'Margarina',
      batchNumber: 10,
      location: 'Fila 3 columna 3',
      quantity: '50 kg',
    },
    {
      id: '6',
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
    const onView = (expiringSupply: ExpiringSupplyI) => {
        setSelectedSupplies(expiringSupply);
    };
  
    const onClose = () => {
        setSelectedSupplies(null);
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
        <h1>Insumos con vencimiento próximo</h1>
        <GenericTable
          columns={columns}
          data={data}
          dropdownOptions={dropdownOptions} // Agrege dropdownOptions
          onView={onView}
          onDelete={onDelete}
          onAdd={onAdd}
          showDropdown={false}
          nameColumnId="name"
        />
      </div>
    );
  }