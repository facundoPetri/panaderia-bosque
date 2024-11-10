import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import DownloadPdfButton from '../../components/DownloadPdfButton';
import ProviderOrderDialogCreate from './ProviderOrderDialogCreate';
import { ProviderResponse } from '../../interfaces/Providers';
import { OrderResponse, TransformedOrder } from '../../interfaces/Orders';
import { SuppliesResponse } from '../../interfaces/Supplies';
import { request } from '../../common/request';
import ProvidersOrdersDialogView from './ProvidersOrdersDialogView';
import { convertToFullDateString } from '../../utils/dateUtils';

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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
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

  // Modal: abrir en modo creación
  const onAdd = () => {
    setIsCreateMode(true);
    setSelectedOrder({
      _id: '',
      number: 0,
      date: '',
      created_at: '',
      provider: {
        _id: '',
        name: '',
        phone: '',
        email: '',
        supplies: [],
        createdAt: new Date(),
      },
      supplies: [],
    });
  };

  const onClose = () => {
    setIsCreateMode(false);
    setSelectedOrder(null);
    setIsEditMode(false);
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
  };

  const onSave = async (order: OrderResponse) => {
    if (order._id) {
      // Editar pedido
      try {
        await request<OrderResponse>({
          path: `/orders/${order._id}`,
          method: 'PATCH',
          data: order,
        });
        getOrders();
      } catch (error) {
        console.error('Error al guardar el pedido:', error);
      }
    } else {
      // Crear nuevo pedido
      try {
        await request<OrderResponse>({
          path: '/orders',
          method: 'POST',
          data: order,
        });
        getOrders();
      } catch (error) {
        console.error('Error al crear el pedido:', error);
      }
    }
    onClose();
  };

  const getProviders = async () => {
    try {
      const res = await request<ProviderResponse[]>({
        path: '/providers',
        method: 'GET',
      });
      if (res) {
        setProviders(res);

        const providerProducts: { [provider: string]: SuppliesResponse[] } = {};
        res.forEach(provider => {
          providerProducts[provider._id] = provider.supplies;
        });
        setProductsByProvider(providerProducts);
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  // Transform function for OrderResponse to TransformedOrder
  const transformOrder = (order: OrderResponse): TransformedOrder => {
    return {
      _id: order._id,
      number: order.number,
      date: convertToFullDateString(order.date),
      created_at: convertToFullDateString(order.created_at),
      provider: order.provider.name,
      supplies: order.supplies.map(supply => supply.name).join(', '),
    };
  };

  const getOrders = async () => {
    try {
      const res = await request<OrderResponse[]>({
        path: '/orders',
        method: 'GET',
      });
      if (res) {
        setOrders(res);
        const transformedOrders = res.map(transformOrder);
        setTransfOrders(transformedOrders);
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

      <ProviderOrderDialogCreate
        isOpen={isCreateMode}
        onClose={onClose}
        order={selectedOrder}
        setOrder={setSelectedOrder}
        onSave={onSave}
        providers={providers}
        productsByProvider={productsByProvider}
      />
      <ProvidersOrdersDialogView
        isOpen={isEditMode}
        onClose={onClose}
        order={selectedOrder}
        onSave={onSave}
        onDelete={onDelete}
      />
    </div>
  );
}
