import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import ProviderDialogEdit from './ProviderDialogEdit';
import { SuppliesResponse } from '../../interfaces/Supplies';
import { request } from '../../common/request';
import ProviderDialogCreate from './ProviderDialogCreate';
import { ProviderResponse, TransformedProvider } from '../../interfaces/Providers';

const columns: Column<TransformedProvider>[] = [
  { id: '_id', label: 'id', hiddenColumn: true, sortable: false, hiddenFilter: true, },
  { id: 'name', label: 'Nombre' },
  { id: 'phone', label: 'Telefono', sortable: false, hiddenFilter: true, },
  { id: 'email', label: 'Email', hiddenFilter: true, },
  { id: 'supplies', label: 'Insumos' },
];

const dropdownOptions = columns
  .filter(column => !column.hiddenFilter)
  .map(column => ({
    title: column.label,
  }));

export default function Providers() {
  const [selectedProvider, setSelectedProvider] = useState<ProviderResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [transformedProvider, setTransformedProvider] = useState<TransformedProvider[]>([])

  const onView = (provider: TransformedProvider) => {
    const selected = providers.find((p) => p._id === provider._id)
    if (selected) {
      setSelectedProvider(selected)
    }
    setIsEditMode(false)
  };

  const onClose = () => {
    setSelectedProvider(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const onDelete = async (id: string) => {
    try {
      const res = await request<any[]>({
        path: `/providers/${id}`,
        method: 'DELETE',
      });
      if (res) {
        getProviders();
      }
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
    }
  };

  const onAdd = () => {
    setIsCreateMode(true);
  };

  const onEdit = (provider: TransformedProvider) => {
    const selected = providers.find((p) => p._id === provider._id)
    if (selected) {
      setSelectedProvider(selected)
    }
    setIsEditMode(true)
  };

  const getSupplies = async () => {
    try {
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
      });
      if (res) {
        setSupplies(res);
      }
    } catch (error) {
      console.error('Error al obtener insumos:', error);
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
        const transformedData = transformData(res)
        setTransformedProvider(transformedData)
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleSave = async (provider: ProviderResponse) => {
    try {
      const res = await request<any[]>({
        path: `/providers/${provider._id}`,
        method: 'PATCH',
        data: provider,
      });
      if (res) {
        getProviders();
      }
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    }
    onClose();
  };

  const handleCreate = async (provider: ProviderResponse) => {
    try {
      const res = await request<any[]>({
        path: '/providers',
        method: 'POST',
        data: provider,
      });
      if (res) {
        getProviders();
      }
    } catch (error) {
      console.error('Error al crear proveedor:', error);
    }
    onClose();
  };

  const transformData = (data: ProviderResponse[]): TransformedProvider[] => {
    return data.map((provider) => ({
      ...provider,
      supplies: provider.supplies
        .map((supply: SuppliesResponse) => supply.name)
        .map((str) => str)
        .join(', '),
    }))
  }

  useEffect(() => {
    getSupplies();
    getProviders();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Listado de proveedores</h1>
      <GenericTable
        columns={columns}
        data={transformedProvider}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onEdit={onEdit}
        onAdd={onAdd}
        nameColumnId="name"
      />
      <ProviderDialogEdit
        provider={selectedProvider}
        onClose={onClose}
        onSave={handleSave}
        editable={isEditMode}
        supplies={supplies}
      />
      <ProviderDialogCreate
        open={isCreateMode}
        onClose={onClose}
        onSave={handleCreate}
        supplies={supplies}
      />
    </div>
  );
}
