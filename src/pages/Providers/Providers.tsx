import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import ProviderDialogEdit from './ProviderDialogEdit';
import { SuppliesResponse } from '../../interfaces/Supplies';
import { request } from '../../common/request';
import ProviderDialogCreate from './ProviderDialogCreate';

const columns: Column<Provider>[] = [
  { id: 'id', label: 'id', hiddenColumn: true, sortable: false, hiddenFilter: true, },
  { id: 'name', label: 'Nombre' },
  { id: 'phone', label: 'Telefono', sortable: false, hiddenFilter: true, },
  { id: 'email', label: 'Email', hiddenFilter: true, },
  { id: 'supplies', label: 'Insumos' },
];

export interface Provider {
  id: string;
  name: string;
  phone: string;
  email: string;
  supplies: string[];
  deliveryTime?: string;
  supplyType?: string;
  image?: string;
}

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function Providers() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  const onView = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsEditMode(false);
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

  const onEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsEditMode(true);
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
      const res = await request<Provider[]>({
        path: '/providers',
        method: 'GET',
      });
      if (res) {
        setProviders(res);
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleSave = async (provider: Provider) => {
    try {
      const res = await request<any[]>({
        path: `/providers/${provider.id}`,
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

  const handleCreate = async (provider: Provider) => {
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

  useEffect(() => {
    getSupplies();
    getProviders();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Listado de proveedores</h1>
      <GenericTable
        columns={columns}
        data={providers}
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
