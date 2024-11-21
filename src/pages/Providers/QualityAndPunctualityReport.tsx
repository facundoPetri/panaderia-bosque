import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import QAndPDialog from './QualityAndPunctualityDialog';
import { ProviderResponse } from '../../interfaces/Providers';
import { UsersResponse } from '../../interfaces/Users';
import { request, requestToast } from '../../common/request';

const columns: Column<QualityAndPunctuality>[] = [
  { id: 'id', label: 'id', hiddenColumn: true, sortable: false, hiddenFilter: true },
  { id: 'name', label: 'Nombre' },
  { id: 'provider', label: 'Proveedor' },
  { id: 'reportDate', label: 'Fecha de informe' },
  { id: 'author', label: 'Autor' },
  { id: 'deliveredItem', label: 'Insumo de entrega' },
];

interface QualityAndPunctuality {
  id: string;
  name: string;
  provider: string;
  reportDate: string;
  author: string;
  deliveredItem: string;
}

const data: QualityAndPunctuality[] = [
  {
    id: '1',
    name: 'Consulta de calidad y puntualidad de Harina 000',
    provider: 'Bimbo',
    reportDate: '01/06/2022',
    author: 'Federico Sanchez',
    deliveredItem: 'Harina',
  },
  {
    id: '2',
    name: 'Consulta de calidad y puntualidad de Crema de leche',
    provider: 'Ledevit',
    reportDate: '03/06/2022',
    author: 'Gaston Rodriguez',
    deliveredItem: 'Crema',
  },
  // Más datos...
];

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }));

export default function QualityAndPunctualityReport() {
  const [selectedReport, setSelectedReport] = useState<QualityAndPunctuality | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [users, setUsers] = useState<UsersResponse[]>([]);

  const getProviders = async () => {
    try {
      const res = await request<ProviderResponse[]>({
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

  const getUsers = async () => {
    try {
      const res = await requestToast<UsersResponse[]>({
        path: '/users',
        method: 'GET',
        successMessage: 'Usuarios cargados',
        errorMessage: 'Error al cargar usuarios',
        pendingMessage: 'Cargando usuarios...',
      });
      if (res) {
        setUsers(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onView = (report: QualityAndPunctuality) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const onSave = (data: any) => {
    console.log('Datos guardados:', data);
    // Aquí puedes manejar la lógica para guardar el reporte
    setIsModalOpen(false);
  };

  const onAdd = () => {
    setSelectedReport(null); // Modal vacío para crear un nuevo reporte
    setIsModalOpen(true);
  };

  const onDelete = (id: string) => {
    console.log(`Eliminando reporte con id: ${id}`);
    // Aquí puedes manejar la lógica de eliminación
  };

  useEffect(() => {
    // Llama a las funciones para cargar datos al montar el componente
    const loadData = async () => {
      await Promise.all([getProviders(), getUsers()]);
    };
    loadData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de calidad y puntualidad de la materia prima</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        nameColumnId="name"
        nameButton="Crear"
      />
      <QAndPDialog
        open={isModalOpen}
        onClose={onClose}
        onSave={onSave}
        providers={providers} // Proveedores cargados
        employees={users} // Empleados cargados
      />
    </div>
  );
}
