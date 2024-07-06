import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

const columns: Column<ProductionEfficiency>[] = [
  { id: 'id', label: 'id' , hidden: true, sortable : false},
  { id: 'name', label: 'Nombre' },
  { id: 'supplies', label: 'Insumos'},
  { id: 'totalTime', label: 'Tiempo total' },
  { id: 'productionQuantity', label: 'Cantidad en produccion' },
];

interface ProductionEfficiency {
  id: string;
  name: string;
  supplies: string;
  totalTime: string;
  productionQuantity: string;
}
  
  const data: ProductionEfficiency[] = [
    {
      id: '1',
      name: 'Criollos comunes',
      supplies: 'Harina, sal, agua, levadura, margarina',
      totalTime: '300m',
      productionQuantity: '100u',
    },
    {
      id: '2',
      name: 'Criollos de hojaldre',
      supplies: 'Harina, levadura, margarina, sal, agua',
      totalTime: '300m',
      productionQuantity: '100u',
    },
    {
      id: '3',
      name: 'Lemon pie',
      supplies: 'Limón, manteca, azúcar, huevo, esencia de vainilla, maizena',
      totalTime: '200m',
      productionQuantity: '8u',
    },
    {
      id: '4',
      name: 'Medialunas',
      supplies: 'Harina leudante, almíbar, azúcar, huevo, esencia de vainilla, miel',
      totalTime: '100m',
      productionQuantity: '24u',
    },
    {
      id: '5',
      name: 'Pan Dulce',
      supplies: 'Harina, Frutos secos, huevos, levadura',
      totalTime: '20m',
      productionQuantity: '3u',
    },
    {
      id: '6',
      name: 'Pan francés',
      supplies: 'Harina, agua, sal, levadura',
      totalTime: '150m',
      productionQuantity: '10u',
    },
  ];   

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function ProductionEfficiencies() {
  const [selectedProductionEfficiency, setSelectedProductionEfficiency] = useState<ProductionEfficiency | null>(null);
//Modal
  const handleView = (productionEfficiencies: ProductionEfficiency) => {
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
      <h1>Eficiencia de producción</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
        onDelete={handleDelete}
        onAdd={handleAdd}
        showDropdown={false}
        nameColumnId="name"
      />
    </div>
  );
}