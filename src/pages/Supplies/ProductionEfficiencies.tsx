import { useState, useEffect } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import { ToastContainer } from 'react-toastify';
import { RecipesResponse } from '../../interfaces/Recipes';
import { request } from '../../common/request';
import ProductionEfficienciesDialog from './ProductionEfficienciesDialog'; // Importa el modal correctamente

const columns: Column<ProductionEfficiency>[] = [
  { id: 'id', label: 'id', hiddenColumn: true, sortable: false },
  { id: 'name', label: 'Nombre' },
  { id: 'supplies', label: 'Insumos' },
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

const dropdownOptions = columns
  .filter(column => !column.hiddenFilter)
  .map(column => ({
    title: column.label,
  }));

export default function ProductionEfficiencies() {
  const [selectedProductionEfficiency, setSelectedProductionEfficiency] = useState<ProductionEfficiency | null>(null);
  const [recipes, setRecipes] = useState<RecipesResponse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Manejo del estado de apertura del modal

  useEffect(() => {
    getRecipes(); // Llama a la función para cargar las recetas al montar el componente
  }, []);

  // Modal: Ver o editar
  const onView = (productionEfficiency: ProductionEfficiency) => {
    setSelectedProductionEfficiency(productionEfficiency);
    setIsDialogOpen(true);
  };

  const onClose = () => {
    setIsDialogOpen(false);
    setSelectedProductionEfficiency(null);
  };

  const onSave = (data: any) => {
    console.log('Datos guardados:', data);
    setIsDialogOpen(false);
    // Aquí puedes manejar la lógica para guardar los datos en el backend
  };

  const onDelete = (id: string) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const onAdd = () => {
    console.log('Agregando nuevo elemento');
    setSelectedProductionEfficiency(null);
    setIsDialogOpen(true);
  };

  const getRecipes = async () => {
    try {
      const res = await request<RecipesResponse[]>({
        path: '/recipes',
        method: 'GET',
      });
      if (res) {
        setRecipes(res);
      }
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Eficiencia de producción</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agregue dropdownOptions
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        showDropdown={false}
        nameColumnId="name"
        nameButton="Crear"
      />
      {isDialogOpen && (
        <ProductionEfficienciesDialog
          open={isDialogOpen}
          onClose={onClose}
          onSave={onSave}
          recipes={recipes} // Pasa las recetas cargadas al modal
        />
      )}
      <ToastContainer />
    </div>
  );
}
