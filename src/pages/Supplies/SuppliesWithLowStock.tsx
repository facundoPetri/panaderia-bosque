import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import { SuppliesResponse, TransformedSupplies, Batch } from '../../interfaces/Supplies';
import { request } from '../../common/request';
import ProviderOrderDialog, { OrderItem } from '../Providers/ProviderOrderDialog';

const columns: Column<TransformedSupplies>[] = [
  { id: '_id', label: 'ID', hiddenColumn: true, sortable: false },
  { id: 'name', label: 'Nombre' },
  { id: 'current_stock', label: 'Stock Actual', hiddenFilter: true },
  { id: 'min_stock', label: 'Stock Mínimo', hiddenFilter: true },
  { id: 'max_stock', label: 'Stock Máximo', hiddenFilter: true },
  { id: 'unit', label: 'Unidad de Medida', hiddenFilter: true },
  { id: 'priority', label: 'Prioridad' },// Added a column for "Ver más"
];

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function SuppliesWithLowStock() {
  const [selectedSupplies, setSelectedSupplies] = useState<TransformedSupplies | null>(null);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [supplies, setSupplies] = useState<TransformedSupplies[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]); // Add orderItems state

  const onView = (supply: TransformedSupplies) => {
    const existingOrderItemIndex = orderItems.findIndex(item => item.id === supply._id);

    if (existingOrderItemIndex !== -1) {
      // Si el item ya existe, incrementa la cantidad
      const updatedOrderItems = [...orderItems];
      updatedOrderItems[existingOrderItemIndex].quantity += 1;
      setOrderItems(updatedOrderItems);
    } else {
      // Si el item no existe, añade un nuevo item con cantidad 1
      const newOrderItem: OrderItem = {
        id: supply._id,
        name: supply.name,
        quantity: 1,
      };
      setOrderItems([...orderItems, newOrderItem]);
    }
  };


  const onClose = () => {
    setSelectedSupplies(null)
    setIsCreateMode(false)
  }

  const onDelete = (id: string) => {
  };

  const onAdd = () => {
    setIsCreateMode(true)
  };

  const handlerSave = async () => {
    const updatedOrderItems = orderItems.map(item => ({
      ...item,
      date_create: new Date().toISOString(),
    }));

    setOrderItems(updatedOrderItems);
    console.log(updatedOrderItems);
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
      <ProviderOrderDialog
        isOpen={isCreateMode}
        onClose={onClose}
        orderItems={orderItems}
        setOrderItems={setOrderItems}
        onSave={handlerSave}
      />
    </div>
  );
}
