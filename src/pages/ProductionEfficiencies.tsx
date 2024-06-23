import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';

const columns: Column<ProductionEfficiency>[] = [
  { id: 'name', label: 'Nombre' },
  { id: 'supplies', label: 'Insumos'},
  { id: 'totalTime', label: 'Tiempo total' },
  { id: 'productionQuantity', label: 'Cantidad en produccion' },
];

interface ProductionEfficiency {
    name: string;
    supplies: string;
    totalTime: string;
    productionQuantity: string;
  }
  
  const data: ProductionEfficiency[] = [
    {
      name: 'Criollos comunes',
      supplies: 'Harina, sal, agua, levadura, margarina',
      totalTime: '300m',
      productionQuantity: '100u',
    },
    {
      name: 'Criollos de hojaldre',
      supplies: 'Harina, levadura, margarina, sal, agua',
      totalTime: '300m',
      productionQuantity: '100u',
    },
    {
      name: 'Lemon pie',
      supplies: 'Limón, manteca, azúcar, huevo, esencia de vainilla, maizena',
      totalTime: '200m',
      productionQuantity: '8u',
    },
    {
      name: 'Medialunas',
      supplies: 'Harina leudante, almíbar, azúcar, huevo, esencia de vainilla, miel',
      totalTime: '100m',
      productionQuantity: '24u',
    },
    {
      name: 'Pan Dulce',
      supplies: 'Harina, Frutos secos, huevos, levadura',
      totalTime: '20m',
      productionQuantity: '3u',
    },
    {
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Eficiencia de producción</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
        showDropdown={false}
      />
    </div>
  );
}