import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

const columns: Column<QualityAndPunctuality>[] = [
  { id: 'id', label: 'id' , hidden: true, sortable : false},
  { id: 'name', label: 'Nombre' },
  { id: 'provider', label: 'Proveedor'},
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
      deliveredItem: 'Harina'
    },
    {
      id: '2',
      name: 'Consulta de calidad y puntualidad de Crema de leche',
      provider: 'Ledevit',
      reportDate: '03/06/2022',
      author: 'Gaston Rodriguez',
      deliveredItem: 'Crema'
    },
    {
      id: '3',
      name: 'Consulta de calidad y puntualidad de Huevos',
      provider: 'Ledesma',
      reportDate: '06/06/2022',
      author: 'Juan Alvarez',
      deliveredItem: 'Huevos'
    },
    {
      id: '4',
      name: 'Consulta de calidad y puntualidad de Manteca',
      provider: 'Mapricoa',
      reportDate: '12/06/2022',
      author: 'Gaston Rodriguez',
      deliveredItem: 'Manteca'
    },
    {
      id: '5',
      name: 'Consulta de calidad y puntualidad de Azúcar',
      provider: 'Merentiel S.A',
      reportDate: '15/06/2022',
      author: 'Julian Gomez',
      deliveredItem: 'Azúcar'
    },
    {
      id: '6',
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

  const handleDelete = (id: number) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const handleAdd = () => {
    console.log('Agregando nuevo elemento');
    // Aquí puedes manejar la lógica de agregar un nuevo elemento
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de calidad y puntualidad de la materia prima</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
        onDelete={handleDelete}
        onAdd={handleAdd}
        nameColumnId="name"
      />
    </div>
  );
}