import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import { SuppliesResponse, TransformedSupplies, Batch } from '../../interfaces/Supplies';
import { request } from '../../common/request';
import { formatDate } from '../../utils/dateUtils';

const columns: Column<TransformedSupplies>[] = [
  { id: '_id', label: 'ID', hiddenColumn: true, sortable: false },
  { id: 'name', label: 'Nombre' },
  { id: 'current_stock', label: 'Stock Actual', hiddenFilter: true },
  { id: 'min_stock', label: 'Stock Mínimo', hiddenFilter: true },
  { id: 'max_stock', label: 'Stock Máximo', hiddenFilter: true },
  { id: 'unit', label: 'Unidad de Medida', hiddenFilter: true },
  { id: 'priority', label: 'Prioridad' },
];

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function SuppliesWithLowStock() {
  const [selectedSupplies, setSelectedSupplies] = useState<TransformedSupplies | null>(null);
  const [supplies, setSupplies] = useState<TransformedSupplies[]>([]);

  const onView = (supply: TransformedSupplies) => {
    setSelectedSupplies(supply);
  };

  const onClose = () => {
    setSelectedSupplies(null);
  };

  const onDelete = (id: string) => {
    console.log(`Eliminando elemento con ID: ${id}`);
    // Lógica para eliminar el elemento con el ID proporcionado
  };

  const onAdd = () => {
    console.log('Agregando nuevo elemento');
    // Lógica para agregar un nuevo elemento
  };

  const calculatePriority = (currentStock: number, minStock: number, maxStock: number): string => {
    if (currentStock <= minStock) {
      return 'Alta';
    } else if (currentStock > minStock && currentStock < maxStock) {
      return 'Media';
    } else {
      return 'Baja';
    }
  };

  const getSupplies = async () => {
    try {
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
      });

      if (res) {
        const transformedSupplies = res.map(supply => {
          const batches: Batch[] = supply.batches || [];

          const currentStock = batches.reduce((total, batch) => total + batch.quantity, 0);

          const priority = calculatePriority(currentStock, supply.min_stock, supply.max_stock);

          return {
            ...supply,
            current_stock: currentStock,
            priority,
          };
        });

        setSupplies(transformedSupplies);
      }
    } catch (error) {
      console.error('Error al obtener los insumos:', error);
    }
  };

  useEffect(() => {
    getSupplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de insumos con bajo stock</h1>
      <GenericTable
        columns={columns}
        data={supplies}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        nameColumnId="name"
        nameButton="Hacer Pedido"
      />
    </div>
  );
}
