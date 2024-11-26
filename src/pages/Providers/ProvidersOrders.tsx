import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import DownloadPdfButton from '../../components/DownloadPdfButton';
import ProviderOrderDialogCreate from './ProviderOrderDialogCreate';
import { ProviderResponse } from '../../interfaces/Providers';
import { OrderResponse, TransformedOrder } from '../../interfaces/Orders';
import { request } from '../../common/request';
import { convertToFullDateString } from '../../utils/dateUtils';
import OrderDetailsDialog from './OrderDetailsDialog';
import { SuppliesResponse } from '../../interfaces/Supplies';

const columns: Column<TransformedOrder>[] = [
  { id: '_id', label: 'ID', hiddenColumn: true, sortable: false, hiddenFilter: true },
  { id: 'number', label: 'Número de Pedido' },
  { id: 'date', label: 'Fecha de Creación', sortable: false, hiddenFilter: true },
  { id: 'provider', label: 'Proveedor' },
  { id: 'supplies', label: 'Insumos', hiddenFilter: true },
];

export default function ProvidersOrders() {
  const [transfOrders, setTransfOrders] = useState<TransformedOrder[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    getProviders();
    getOrders();
  }, []);

  const dropdownOptions = columns
    .filter(column => !column.hiddenFilter)
    .map(column => ({
      title: column.label,
    }));

  const onAdd = () => {
    setIsCreateMode(true);
  };

  const onClose = () => {
    setIsCreateMode(false);
    setSelectedOrder(null);
  };

  const onView = (orderView: TransformedOrder) => {
    const originalOrder = orders.find(order => order._id === orderView._id);
    if (originalOrder) {
      setSelectedOrder(originalOrder);
    } else {
      console.error("No se encontró el pedido original para ver.");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await request({ path: `/orders/${id}`, method: 'DELETE' });
      getOrders();
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  const onSave = async (order: OrderResponse | { provider: ProviderResponse; supplies: { product: SuppliesResponse; quantity: number }[] }) => {
    if ('supplies' in order && Array.isArray(order.supplies) && 'product' in order.supplies[0]) {
      // Si el formato es el nuevo, manejamos la creación del pedido
      const newOrder = order as { provider: ProviderResponse; supplies: { product: SuppliesResponse; quantity: number }[] };
      try {
        const orderToSave: Omit<OrderResponse, '_id'> = {
          number: newOrder.supplies.reduce((sum, item) => sum + item.quantity, 0),
          date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          provider: newOrder.provider,
          supplies: newOrder.supplies.map(item => ({
            ...item.product,
            quantity: item.quantity,
          })),
        };
        await request<OrderResponse>({ path: '/orders', method: 'POST', data: orderToSave });
        getOrders();
      } catch (error) {
        console.error('Error al guardar el pedido:', error);
      }
    } else {
      // Si es un OrderResponse, podrías implementar alguna acción específica aquí
      console.error('Formato de pedido no manejado:', order);
    }
    onClose();
  };
  

  const getProviders = async () => {
    try {
      const res = await request<ProviderResponse[]>({ path: '/providers', method: 'GET' });
      if (res) setProviders(res);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const transformOrder = (order: OrderResponse): TransformedOrder => ({
    _id: order._id,
    number: order.number,
    date: convertToFullDateString(order.date),
    created_at: convertToFullDateString(order.created_at),
    provider: order.provider.name,
    supplies: order.supplies.map(supply => supply.name).join(', '),
  });

  const getOrders = async () => {
    try {
      const res = await request<OrderResponse[]>({ path: '/orders', method: 'GET' });
      if (res) {
        setOrders(res);
        setTransfOrders(res.map(transformOrder));
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pedidos a Proveedores</h1>
      <GenericTable
        columns={columns}
        data={transfOrders}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onAdd={onAdd}
        onDelete={onDelete}
        nameColumnId="number"
      />
      <DownloadPdfButton url="http://localhost:3000/orders/generate-pdf" />

      {isCreateMode && (
        <ProviderOrderDialogCreate
          isOpen={isCreateMode}
          onClose={onClose}
          onSave={onSave}
          providers={providers}
        />
      )}

      {selectedOrder && (
        <OrderDetailsDialog
          isOpen={Boolean(selectedOrder)}
          onClose={onClose}
          order={selectedOrder}
          onSave={onSave}
        />
      )}
    </div>
  );
}
