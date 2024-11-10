import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import DownloadPdfButton from '../../components/DownloadPdfButton';
import ProviderOrderDialogCreate from './ProviderOrderDialogCreate';
import { ProviderResponse } from '../../interfaces/Providers';
import { OrderResponse, TransformedOrder } from '../../interfaces/Orders';
import { SuppliesResponse } from '../../interfaces/Supplies';
import { request } from '../../common/request';
import { convertToFullDateString } from '../../utils/dateUtils';
import OrderDetailsDialog from './OrderDetailsDialog';

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
  const [productsByProvider, setProductsByProvider] = useState<{ [provider: string]: SuppliesResponse[] }>({});
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

  // Open creation modal and initialize empty order
  const onAdd = () => {
    setIsCreateMode(true);
    setSelectedOrder(null); // Clear selected order to indicate creation mode
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

  const onSave = async (order: OrderResponse) => {
    try {
      if (order._id) {
        await request<OrderResponse>({ path: `/orders/${order._id}`, method: 'PATCH', data: order });
      } else {
        await request<OrderResponse>({ path: '/orders', method: 'POST', data: order });
      }
      getOrders();
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
    }
    onClose();
  };

  const getProviders = async () => {
    try {
      const res = await request<ProviderResponse[]>({ path: '/providers', method: 'GET' });
      if (res) {
        setProviders(res);
        setProductsByProvider(
          res.reduce((acc, provider) => {
            acc[provider._id] = provider.supplies;
            return acc;
          }, {} as { [provider: string]: SuppliesResponse[] })
        );
      }
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
          order={selectedOrder} // null when creating
          setOrder={setSelectedOrder}
          onSave={onSave}
          providers={providers}
          productsByProvider={productsByProvider}
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
