import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

const columns: Column<WasteReport>[] = [
  { id: 'date', label: 'Fecha' },
  { id: 'reportingEmployee', label: 'Empleado que reporta'},
  { id: 'reason', label: 'Motivo' },
  { id: 'involvedEmployee', label: 'Empleado involucrado' },
  { id: 'wastedSupplies', label: 'Insumos desperdiciados' },
];

interface WasteReport {
    date: string;
    reportingEmployee: string;
    reason: string;
    involvedEmployee: string;
    wastedSupplies: string;
  }
  
  // Constants with the extracted values
  const data: WasteReport[] = [
    {
      date: '30/09/2023',
      reportingEmployee: 'Gustavo Gomez',
      reason: 'Equivocación en la preparación',
      involvedEmployee: 'Gustavo Gomez',
      wastedSupplies: 'Harina, azúcar',
    },
    {
      date: '03/09/2023',
      reportingEmployee: 'Micaela Acosta',
      reason: 'Se pasó el tiempo en la preparación',
      involvedEmployee: 'Micaela Acosta',
      wastedSupplies: 'Harina, levadura',
    },
    {
      date: '03/09/2023',
      reportingEmployee: 'Micaela Acosta',
      reason: 'Otros',
      involvedEmployee: 'Gustavo Gomez',
      wastedSupplies: 'Harina',
    },
    {
      date: '20/08/2023',
      reportingEmployee: 'Gustavo Gomez',
      reason: 'Daño en el transporte',
      involvedEmployee: 'Gustavo Gomez',
      wastedSupplies: 'Manteca, crema',
    },
    {
      date: '15/08/2023',
      reportingEmployee: 'Esteban Rolon',
      reason: 'Producto vencido',
      involvedEmployee: 'Juan Medina',
      wastedSupplies: 'Manteca, crema',
    },
    {
      date: '14/08/2023',
      reportingEmployee: 'Juan Medina',
      reason: 'Producto vencido',
      involvedEmployee: 'Juan Medina',
      wastedSupplies: 'Huevos',
    },
  ];  

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function WasteReports() {
  const [selectedOrder, setSelectedOrder] = useState<WasteReport | null>(null);
//Modal
  const handleView = (wasteReport: WasteReport) => {
    setSelectedOrder(wasteReport);
  };

  const handleClose = () => {
    setSelectedOrder(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Desperdicio de inventario</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
      />
    </div>
  );
}