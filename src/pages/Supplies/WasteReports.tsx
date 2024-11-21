import { useState, useEffect } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import WasteReportDialog from './wasteReportsDialog';
import { requestToast } from '../../common/request';
import { UsersResponse } from '../../interfaces/Users';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SuppliesResponse } from '../../interfaces/Supplies';

const columns: Column<WasteReport>[] = [
  { id: 'id', label: 'id', hiddenColumn: true, sortable: false, hiddenFilter: true },
  { id: 'date', label: 'Fecha', hiddenFilter: true },
  { id: 'reportingEmployee', label: 'Empleado que reporta' },
  { id: 'reason', label: 'Motivo' },
  { id: 'involvedEmployee', label: 'Empleado involucrado' },
  { id: 'wastedSupplies', label: 'Insumos desperdiciados' },
];

interface WasteReport {
  id: string;
  date: string;
  reportingEmployee: string;
  reason: string;
  involvedEmployee: string;
  wastedSupplies: string;
}

const dataMock: WasteReport[] = [
  {
    id: '1',
    date: '30/09/2023',
    reportingEmployee: 'Gustavo Gomez',
    reason: 'Equivocación en la preparación',
    involvedEmployee: 'Gustavo Gomez',
    wastedSupplies: 'Harina, azúcar',
  },
  {
    id: '2',
    date: '03/09/2023',
    reportingEmployee: 'Micaela Acosta',
    reason: 'Se pasó el tiempo en la preparación',
    involvedEmployee: 'Micaela Acosta',
    wastedSupplies: 'Harina, levadura',
  },
  {
    id: '3',
    date: '03/09/2023',
    reportingEmployee: 'Micaela Acosta',
    reason: 'Otros',
    involvedEmployee: 'Gustavo Gomez',
    wastedSupplies: 'Harina',
  },
  {
    id: '4',
    date: '20/08/2023',
    reportingEmployee: 'Gustavo Gomez',
    reason: 'Daño en el transporte',
    involvedEmployee: 'Gustavo Gomez',
    wastedSupplies: 'Manteca, crema',
  },
  {
    id: '5',
    date: '15/08/2023',
    reportingEmployee: 'Esteban Rolon',
    reason: 'Producto vencido',
    involvedEmployee: 'Juan Medina',
    wastedSupplies: 'Manteca, crema',
  },
  {
    id: '6',
    date: '14/08/2023',
    reportingEmployee: 'Juan Medina',
    reason: 'Producto vencido',
    involvedEmployee: 'Juan Medina',
    wastedSupplies: 'Huevos',
  },
];

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }));

export default function WasteReports() {
  const [, setSelectedOrder] = useState<WasteReport | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UsersResponse[]>([]);
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([]);
  const [data, setData] = useState<WasteReport[]>(dataMock); // Mock data reemplazable con datos reales.

  // Función para obtener usuarios
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

  // Función para obtener insumos
  const getSupplies = async () => {
    try {
      const res = await requestToast<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
        successMessage: 'Insumos cargados',
        errorMessage: 'Error al cargar insumos',
        pendingMessage: 'Cargando insumos...',
      });
      if (res) {
        setSupplies(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Función para manejar la vista del diálogo
  const onView = (wasteReport: WasteReport) => {
    setSelectedOrder(wasteReport);
    setIsDialogOpen(true);
  };

  // Función para cerrar el diálogo
  const onClose = () => {
    setSelectedOrder(null);
    setIsDialogOpen(false);
  };

  // Función para agregar un nuevo reporte
  const onAdd = () => {
    setSelectedOrder(null);
    setIsDialogOpen(true);
  };

  // Función para eliminar un reporte
  const onDelete = (id: string) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes integrar la lógica de eliminación
  };

  // Obtener datos iniciales
  useEffect(() => {
    getUsers();
    getSupplies();
    // Aquí puedes agregar lógica para cargar los datos de `WasteReport` desde tu API
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Desperdicio de inventario</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions}
        onDelete={onDelete}
        onAdd={onAdd}
        onView={onView}
        nameColumnId="reason"
        nameButton="Agregar desperdicio"
      />
      {isDialogOpen && (
        <WasteReportDialog
          open={isDialogOpen}
          onClose={onClose}
          onSave={(formData) => {
            console.log('Guardando datos del formulario:', formData);
            onClose(); // Cerrar el diálogo después de guardar
          }}
          users={users}
          supplies={supplies}
        />
      )}
      <ToastContainer />
    </div>
  );
}
