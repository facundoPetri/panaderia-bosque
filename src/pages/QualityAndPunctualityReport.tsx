import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

const columns: Column<QualityAndPunctuality>[] = [
  { id: 'name', label: 'Nombre' },
  { id: 'provider', label: 'Proveedor'},
  { id: 'reportDate', label: 'Fecha de informe' },
  { id: 'author', label: 'Autor' },
  { id: 'deliveredItem', label: 'Insumo de entrega' },
];

interface QualityAndPunctuality {
    name: string;
    provider: string;
    reportDate: string;
    author: string;
    deliveredItem: string;
}
  
const data: QualityAndPunctuality[] = [
    {
        name: 'Consulta de calidad y puntualidad de Harina 000',
        provider: 'Bimbo',
        reportDate: '01/06/2022',
        author: 'Federico Sanchez',
        deliveredItem: 'Harina'
    },
    {
        name: 'Consulta de calidad y puntualidad de Crema de leche',
        provider: 'Ledevit',
        reportDate: '03/06/2022',
        author: 'Gaston Rodriguez',
        deliveredItem: 'Crema'
    },
    {
        name: 'Consulta de calidad y puntualidad de Huevos',
        provider: 'Ledesma',
        reportDate: '06/06/2022',
        author: 'Juan Alvarez',
        deliveredItem: 'Huevos'
    },
    {
        name: 'Consulta de calidad y puntualidad de Manteca',
        provider: 'Mapricoa',
        reportDate: '12/06/2022',
        author: 'Gaston Rodriguez',
        deliveredItem: 'Manteca'
    },
    {
        name: 'Consulta de calidad y puntualidad de Azúcar',
        provider: 'Merentiel S.A',
        reportDate: '15/06/2022',
        author: 'Julian Gomez',
        deliveredItem: 'Azúcar'
    },
    {
        name: 'Consulta de calidad y puntualidad de Levadura en polvo',
        provider: 'Ramirez y Hnos. S.R.L',
        reportDate: '20/06/2022',
        author: 'Juan Alvarez',
        deliveredItem: 'Levadura'
    }
]; 

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function QualityAndPunctualityReport() {
  const [selectedProductionEfficiency, setSelectedProductionEfficiency] = useState<QualityAndPunctuality | null>(null);
//Modal
  const handleView = (productionEfficiencies: QualityAndPunctuality) => {
    setSelectedProductionEfficiency(productionEfficiencies);
  };

  const handleClose = () => {
    setSelectedProductionEfficiency(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de calidad y puntualidad de la materia prima</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
      />
    </div>
  );
}