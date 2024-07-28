import React, { useEffect, useState } from 'react';
import GenericTable, { Column } from '../../components/GenericTable';
import MachineMaintenanceDialogEdit from './MachineMaintenanceDialogEdit';
import MachineMaintenanceDialogCreate from './MachinesMaintenanceDialogCreate';
import { MachinesResponse, TransformedMachines } from '../../interfaces/Machines';
import { request } from '../../common/request';
import { formatDate } from '../../utils/dateUtils';

const columns: Column<TransformedMachines>[] = [
  { id: '_id', label: 'id', hiddenColumn: true, sortable: false },
  { id: 'name', label: 'Nombre' },
  { id: 'user_name', label: 'Usuario' },
  { id: 'purchase_date', label: 'Fecha de adquisición' },
  { id: 'last_maintenance_date', label: 'Fecha del último mantenimiento' },
  { id: 'desired_maintenance', label: 'Mantenimiento deseado' },
  { id: 'priority', label: 'Prioridad' },
];

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function MachinesMaintenance() {
  const [selectedMachineMaintenance, setSelectedMachineMaintenance] = useState<TransformedMachines | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [machines, setMachines] = useState<TransformedMachines[]>([]);

  const onView = (machineMaintenance: TransformedMachines) => {
    setSelectedMachineMaintenance(machineMaintenance);
    setIsEditMode(false);
  };

  const onClose = () => {
    setSelectedMachineMaintenance(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const onDelete = async(id: string) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
    try {
      const res = await request<any[]>({
        path: `machines/${id}`,
        method: 'DELETE',
      })
      if (res) {
        getMachines()
      }
    } catch (error) {
      console.error(error)
    }
  };

  const onAdd = () => {
    setIsCreateMode(true);
  };

  const handleEdit = (machineMaintenance: TransformedMachines) => {
    setSelectedMachineMaintenance(machineMaintenance);
    setIsEditMode(true);
  };

  const handleSave = async(machineMaintenance: TransformedMachines) => {
    console.log('Guardando cambios', machineMaintenance);
    // Aquí puedes manejar la lógica para guardar los cambios del usuario
    const data = {
      name: machineMaintenance.name,
      description: machineMaintenance.description,
      desired_maintenance: machineMaintenance.desired_maintenance,
      purcharse_date: machineMaintenance.purchase_date
    }
    
    try {
      const res = await request<any[]>({
        path: `/machines/${machineMaintenance._id}`,
        method: 'PUT',
        data
      })
      if (res) {
        getMachines()
      }
    } catch (error) {
      console.error(error)
    }
    setSelectedMachineMaintenance(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const handleCreate = async(machineMaintenance: any) => {
    console.log('Creando usuario', machineMaintenance);
    // Aquí puedes manejar la lógica para crear un nuevo usuario
    const data = {
      name: machineMaintenance.name,
      description: machineMaintenance.description,
      desired_maintenance: machineMaintenance.desired_maintenance,
      purcharse_date: machineMaintenance.purcharse_date
    }
    
    try {
      const res = await request<any[]>({
        path: '/machines',
        method: 'POST',
        data
      })
      if (res) {
        getMachines()
      }
    } catch (error) {
      console.error(error)
    }
    setIsCreateMode(false);
  };

  const calculatePriority = (lastMaintenanceDate: string, desiredMaintenance: number): string => {
    const now = new Date();
    const lastMaintenance = new Date(lastMaintenanceDate);
    const daysDifference = Math.floor((now.getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24));
    const desiredDays = desiredMaintenance;

    if (daysDifference > desiredDays + 5) {
      return 'Alta';
    } else if (daysDifference >= desiredDays - 5 && daysDifference <= desiredDays + 5) {
      return 'Media';
    } else {
      return 'Baja';
    }
  };

  const transformUserData = (data: MachinesResponse[]): TransformedMachines[] => {
    return data.map(machine => ({
      ...machine,
      name: machine?.name ? machine.name : '',
      description: machine.description,
      purchase_date: formatDate(machine.purchase_date),
      desired_maintenance: machine.desired_maintenance,
      last_maintenance_date: formatDate(machine.last_maintenance_date),
      createdAt: formatDate(machine.createdAt),
      updatedAt: formatDate(machine.updatedAt),
      priority: calculatePriority(machine.last_maintenance_date, machine.desired_maintenance), // Calcular prioridad
      user_name: machine.user_id.fullname,
    }));
  };

  const getMachines = async () => {
    try {
      const res = await request<MachinesResponse[]>({
        path: '/machines',
        method: 'GET',
      });
      if (res) {
        const transformedData = transformUserData(res);
        setMachines(transformedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMachines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión y mantenimiento de maquinaria</h1>
      <GenericTable
        columns={columns}
        data={machines}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        showDropdown={false}
        nameColumnId="name"
      />
      <MachineMaintenanceDialogCreate open={isCreateMode} onClose={onClose} onSave={handleCreate} />
      <MachineMaintenanceDialogEdit machineMaintenance={selectedMachineMaintenance} onClose={onClose} editable={isEditMode} onSave={handleSave} />
    </div>
  );
}