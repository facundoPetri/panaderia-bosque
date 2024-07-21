import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import RecipeDialogEdit from './RecipeDialogEdit';
import RecipeDialogCreate from './RecipeDialogCreate';
import { Column } from '../../components/GenericTable';
import { RecipesResponse } from '../../interfaces/Recipes';
import { request } from '../../common/request';
import { formatDate } from '../../utils/dateUtils';

const columns: Column<RecipesResponse>[] = [
  { id: '_id', label: 'id', hiddenColumn: true, sortable: false, hiddenFilter: true },
  { id: 'name', label: 'Nombre' },
  { id: 'ingredients', label: 'Ingredientes', sortable: false },
  { id: 'author', label: 'Autor' },
  { id: 'standardUnits', label: 'Usos' },
  { id: 'createdAt', label: 'Fecha de creación' },
  { id: 'updatedAt', label: 'Fecha de modificación' },
];

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipesResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<RecipesResponse[]>([]);

  // Modal
  const onView = (recipe: RecipesResponse) => {
    setSelectedRecipe(recipe);
    setIsEditMode(false);
  };

  const onClose = () => {
    setSelectedRecipe(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const onDelete = (id: string) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const onAdd = () => {
    setIsCreateMode(true);
  };

  const handleEdit = (recipe: RecipesResponse) => {
    setSelectedRecipe(recipe);
    setIsEditMode(true);
  };

  const handleSave = (recipe: RecipesResponse) => {
    console.log('Guardando cambios', recipe);
    // Aquí puedes manejar la lógica para guardar los cambios del usuario
    setSelectedRecipe(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const handleCreate = (recipe: RecipesResponse) => {
    console.log('Creando receta', recipe);
    // Aquí puedes manejar la lógica para crear una nueva receta
    setIsCreateMode(false);
  };

  const getRecipes = async () => {
    try {
      const res = await request<RecipesResponse[]>({
        path: '/recipes',
        method: 'GET',
      });
      if (res) {
        // Formatear las fechas aquí
        const formattedRecipes = res.map(recipe => ({
          ...recipe,
          createdAt: formatDate(recipe.createdAt),
          updatedAt: formatDate(recipe.updatedAt),
        }));
        setRecipes(formattedRecipes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consultar recetas</h1>
      <GenericTable
        columns={columns}
        data={recipes}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        nameColumnId="name"
      />

      <RecipeDialogEdit recipe={selectedRecipe} onClose={onClose} editable={isEditMode} onSave={handleSave} />
      <RecipeDialogCreate open={isCreateMode} onClose={onClose} onSave={handleCreate} />
    </div>
  );
}
