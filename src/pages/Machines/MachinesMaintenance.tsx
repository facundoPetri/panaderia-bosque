import React, { useState } from 'react';
import GenericTable, { Column } from '../../components/GenericTable';
import MachineMaintenanceDialogEdit from './MachineMaintenanceDialogEdit';

interface MachineMaintenance {
  id: string;
  name: string;
  user: string;
  acquisitionDate: string;
  lastMaintenanceDate: string;
  desiredMaintenanceInterval: string;
  priority: string;
}

const columns: Column<MachineMaintenance>[] = [
  { id: 'id', label: 'id' , hiddenColumn: true, sortable : false},
  { id: 'name', label: 'Nombre' },
  { id: 'user', label: 'Usuario' },
  { id: 'acquisitionDate', label: 'Fecha de adquisición' },
  { id: 'lastMaintenanceDate', label: 'Fecha del último mantenimiento' },
  { id: 'desiredMaintenanceInterval', label: 'Mantenimiento deseado' },
  { id: 'priority', label: 'Prioridad' },
];

const data: MachineMaintenance[] = [
  {
    id: '1',
    name: 'Amasadora',
    user: 'Kevin Zenon',
    acquisitionDate: '01/06/2022',
    lastMaintenanceDate: '01/12/2023',
    desiredMaintenanceInterval: '60 días',
    priority: 'Media',
  },
  {
    id: '2',
    name: 'Batidora de mano',
    user: 'Miguel Merentiel',
    acquisitionDate: '03/06/2022',
    lastMaintenanceDate: '03/10/2023',
    desiredMaintenanceInterval: '35 días',
    priority: 'Alta',
  },
  {
    id: '3',
    name: 'Cámara de fermentación',
    user: 'Cristian Erbes',
    acquisitionDate: '06/06/2022',
    lastMaintenanceDate: '06/02/2024',
    desiredMaintenanceInterval: '30 días',
    priority: 'Baja',
  },
  {
    id: '4',
    name: 'Heladera',
    user: 'Santiago Silva',
    acquisitionDate: '12/06/2022',
    lastMaintenanceDate: '12/01/2024',
    desiredMaintenanceInterval: '20 días',
    priority: 'Baja',
  },
  {
    id: '5',
    name: 'Horno a gas',
    user: 'Cristian Medina',
    acquisitionDate: '15/06/2022',
    lastMaintenanceDate: '15/02/2024',
    desiredMaintenanceInterval: '15 días',
    priority: 'Baja',
  },
  {
    id: '6',
    name: 'Horno eléctrico',
    user: 'Daniel Osvaldo',
    acquisitionDate: '20/06/2022',
    lastMaintenanceDate: '01/03/2024',
    desiredMaintenanceInterval: '70 días',
    priority: 'Baja',
  },
];

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function MachinesMaintenance() {
  const [selectedMachineMaintenance, setSelectedMachineMaintenance] = useState<MachineMaintenance | null>(null);

  const onView = (maintenance: MachineMaintenance) => {
    setSelectedMachineMaintenance(maintenance);
  };

  const onClose = () => {
    setSelectedMachineMaintenance(null);
  };

  const onDelete = (id: number) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const onAdd = () => {
    console.log('Agregando nuevo elemento');
    // Aquí puedes manejar la lógica de agregar un nuevo elemento
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión y mantenimiento de maquinaria</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        showDropdown={false}
        nameColumnId="name"
      />
      <MachineMaintenanceDialogEdit
        open={selectedMachineMaintenance !== null}
        onClose={onClose}
        machineMaintenance={selectedMachineMaintenance}
      />
    </div>
  );
}
