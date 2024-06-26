import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import RecipeDialog from '../components/RecipeDialog';
import { Column } from '../components/GenericTable';

interface Recipe {
  name: string;
  ingredients: string;
  author: string;
  applications: number;
  creationDate: string;
  modificationDate: string;
}

const columns: Column<Recipe>[] = [
  { id: 'name', label: 'Nombre' },
  { id: 'ingredients', label: 'Ingredientes' , sortable: false},
  { id: 'author', label: 'Autor' },
  { id: 'applications', label: 'Usos' },
  { id: 'creationDate', label: 'Fecha de creación' },
  { id: 'modificationDate', label: 'Fecha de modificación' },
];

const data: Recipe[] = [
  {
    name: 'Criollos comunes',
    ingredients: 'Harina, sal, agua, levadura, margarina.',
    author: 'Federico Sanchez',
    applications: 12,
    creationDate: '13/06/2022',
    modificationDate: '19/06/2022',
  },
  {
    name: 'Criollos de hojaldre',
    ingredients: 'Harina, levadura, margarina, sal, agua.',
    author: 'Gaston Rodriguez',
    applications: 10,
    creationDate: '17/06/2022',
    modificationDate: '19/06/2022',
  },
  {
    name: 'Lemon pie',
    ingredients: 'Limón, manteca, azúcar, huevo, esencia de vainilla, maizena.',
    author: 'Juan Alvarez',
    applications: 8,
    creationDate: '18/06/2022',
    modificationDate: '18/06/2022',
  },
  {
    name: 'Medialunas',
    ingredients: 'Harina leudante, almibar, azúcar, huevo, esencia de vainilla, miel.',
    author: 'Gaston Rodriguez',
    applications: 15,
    creationDate: '10/06/2022',
    modificationDate: '11/07/2022',
  },
  {
    name: 'Pan Dulce',
    ingredients: 'Harina, frutos secos, huevos, levadura.',
    author: 'Julian Gomez',
    applications: 7,
    creationDate: '10/06/2022',
    modificationDate: '12/06/2022',
  },
  {
    name: 'Pan francés',
    ingredients: 'Harina, agua , sal, levadura.',
    author: 'Juan Alvarez',
    applications: 22,
    creationDate: '13/06/2022',
    modificationDate: '23/06/2022',
  },
];


const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
//Modal
  const handleView = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleClose = () => {
    setSelectedRecipe(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consultar recetas</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
      />
      <RecipeDialog open={!!selectedRecipe} onClose={handleClose} recipe={selectedRecipe} />
    </div>
  );
}