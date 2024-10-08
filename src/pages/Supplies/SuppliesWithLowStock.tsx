import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import { SuppliesResponse, TransformedSupplies, Batch } from '../../interfaces/Supplies';
import { request } from '../../common/request';
import ProviderOrderDialog from '../Providers/ProviderOrderDialog';
import { ProviderResponse } from '../../interfaces/Providers';
import { OrderResponse } from '../../interfaces/Orders';

const columns: Column<TransformedSupplies>[] = [
  { id: '_id', label: 'Id', hiddenColumn: true, sortable: false, hiddenFilter: true },
  { id: 'name', label: 'Nombre' },
  { id: 'current_stock', label: 'Stock Actual', hiddenFilter: true },
  { id: 'min_stock', label: 'Stock Mínimo', hiddenFilter: true },
  { id: 'max_stock', label: 'Stock Máximo', hiddenFilter: true },
  { id: 'unit', label: 'Unidad de Medida', hiddenFilter: true },
  { id: 'priority', label: 'Prioridad' },
];

const dropdownOptions = columns
  .filter(column => !column.hiddenFilter)
  .map(column => ({
    title: column.label,
  }));

export default function SuppliesWithLowStock() {
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [supplies, setSupplies] = useState<TransformedSupplies[]>([]);
  const [order, setOrder] = useState<OrderResponse>({
    _id: '',
    number: 0,
    date: new Date(),
    created_at: new Date(),
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
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [productsByProvider, setProductsByProvider] = useState<{ [provider: string]: SuppliesResponse[] }>({});

  const onClose = () => {
    setIsCreateMode(false);
  };

  const onAdd = () => {
    setOrder({
      _id: '',
      number: 0,
      date: new Date(),
      created_at: new Date(),
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
    setIsCreateMode(true);
  };

  const handlerSave = (order: OrderResponse) => {
    console.log('Pedido guardado:', order);
    onClose();
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

  useEffect(() => {
    toast.promise(Promise.all([getSupplies(), getProviders()]), {
      pending: 'Cargando insumos...',
      success: 'Insumos cargados',
      error: 'Error al cargar insumos',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de insumos con bajo stock</h1>
      <GenericTable
        columns={columns}
        data={supplies}
        dropdownOptions={dropdownOptions}
        onView={() => { }}
        onDelete={() => { }}
        onAdd={onAdd}
        nameColumnId="name"
        nameButton={"Hacer Pedido"}
        hiddenButtonModal={false}
      />
      <ProviderOrderDialog
        isOpen={isCreateMode}
        onClose={onClose}
        order={order}
        setOrder={setOrder}
        onSave={handlerSave}
        providers={providers}
        productsByProvider={productsByProvider}
      />
      <ToastContainer />
    </div>
  );
}
