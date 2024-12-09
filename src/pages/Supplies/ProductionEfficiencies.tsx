import { useState, useEffect } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import { ToastContainer } from 'react-toastify';
import { RecipesResponse } from '../../interfaces/Recipes';
import { request, requestToast } from '../../common/request';
import ProductionEfficienciesDialog from './ProductionEfficienciesDialog'; // Importa el modal correctamente

const columns: Column<ProductionEfficiency>[] = [
  { id: '_id', label: 'id', hiddenColumn: true, sortable: false },
  { id: 'name', label: 'Nombre' },
  { id: 'supplies', label: 'Insumos' },
  { id: 'totalTime', label: 'Tiempo total' },
  { id: 'productionQuantity', label: 'Cantidad en produccion' },
];

interface ProductionEfficiency {
  _id: string;
  name: string;
  supplies: string;
  totalTime: string;
  productionQuantity: string;
}

const data: ProductionEfficiency[] = [
  {
    _id: '1',
    name: 'Criollos comunes',
    supplies: 'Harina, sal, agua, levadura, margarina',
    totalTime: '300m',
    productionQuantity: '100u',
  },
  {
    _id: '2',
    name: 'Criollos de hojaldre',
    supplies: 'Harina, levadura, margarina, sal, agua',
    totalTime: '300m',
    productionQuantity: '100u',
  },
  {
    _id: '3',
    name: 'Lemon pie',
    supplies: 'Limón, manteca, azúcar, huevo, esencia de vainilla, maizena',
    totalTime: '200m',
    productionQuantity: '8u',
  },
  {
    _id: '4',
    name: 'Medialunas',
    supplies: 'Harina leudante, almíbar, azúcar, huevo, esencia de vainilla, miel',
    totalTime: '100m',
    productionQuantity: '24u',
  },
  {
    _id: '5',
    name: 'Pan Dulce',
    supplies: 'Harina, Frutos secos, huevos, levadura',
    totalTime: '20m',
    productionQuantity: '3u',
  },
  {
    _id: '6',
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productionLogs, setProductionLogs] = useState<any[]>([])


  // Modal: Ver o editar
  const onView = (productionEfficiency: ProductionEfficiency) => {
    setSelectedProductionEfficiency(productionEfficiency);
    setIsDialogOpen(true);
  };

  const onClose = () => {
    setIsDialogOpen(false);
    setSelectedProductionEfficiency(null);
  };

  const onSave = async(data: any) => {
    try {
      const res = await requestToast<any[]>({
        path: '/production',
        method: 'POST',
        data:data,
        successMessage: 'Informe Creado',
        errorMessage: 'Error al crear',
        pendingMessage: 'Cargando...',
      })
      if (res) {
        getProduction()
      }
    } catch (error) {
      console.error(error)
    }
    setIsDialogOpen(false);
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
  const getProduction = async () => {
    try {
      const res = await request<any[]>({
        path: '/production',
        method: 'GET',
      });
      if (res) {
        setProductionLogs(res);
      }
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    }
  };
  useEffect(() => {
    getRecipes();
    getProduction() 
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Rendimiento de producción</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agregue dropdownOptions
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        showDropdown={false}
        nameColumnId="name"
        nameButton="Crear informe"
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
