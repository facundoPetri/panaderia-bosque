import { useEffect, useState } from 'react'
import GenericTable from '../../components/GenericTable'
import RecipeDialogEdit from './RecipeDialogEdit'
import RecipeDialogCreate from './RecipeDialogCreate'
import { Column } from '../../components/GenericTable'
import { RecipesResponse, TransformedRecipes } from '../../interfaces/Recipes'
import { request } from '../../common/request'
import { formatDate } from '../../utils/dateUtils'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { capitalizeFullName } from '../../utils/capitalizeFullName'
import DownloadPdfButton from '../../components/DownloadPdfButton'

const columns: Column<TransformedRecipes>[] = [
  {
    id: '_id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'name', label: 'Nombre' },
  { id: 'ingredients', label: 'Ingredientes', sortable: false },
  { id: 'author', label: 'Autor' },
  { id: 'standardUnits', label: 'Usos' },
  { id: 'createdAt', label: 'Fecha de creación' },
  { id: 'updatedAt', label: 'Fecha de modificación' },
]

const dropdownOptions = columns.map((column) => ({
  title: column.label,
}))

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<TransformedRecipes | null>(
    null
  )
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [recipes, setRecipes] = useState<TransformedRecipes[]>([])

  // Modal
  const onView = (recipe: TransformedRecipes) => {
    setSelectedRecipe(recipe)
    setIsEditMode(false)
  }

  const onClose = () => {
    setSelectedRecipe(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const onDelete = async (id: string) => {
    console.log(`Eliminando elemento con id: ${id}`)
    // Aquí puedes llamar a tu servicio de eliminación con el id
    try {
      const res = await request<any[]>({
        path: `/recipes/${id}`,
        method: 'DELETE',
      })
      if (res) {
        getRecipes()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onAdd = () => {
    setIsCreateMode(true)
  }

  const handleEdit = (recipe: TransformedRecipes) => {
    setSelectedRecipe(recipe)
    setIsEditMode(true)
  }

  const getSupplies = async () => {
    try {
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
      })
      if (res) {
        setSupplies(res)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getSupplies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async (recipe: TransformedRecipes) => {
    //author and supplies, not working
    const data = {
      steps: recipe.steps,
      name: recipe.name,
      recommendations: recipe.recommendations,
      supplies: recipe.supplies,
      standardUnits: Number(recipe.standardUnits),
    }

    try {
      const res = await request<any[]>({
        path: `/recipes/${recipe._id}`,
        method: 'PATCH',
        data,
      })
      if (res) {
        getRecipes()
      }
    } catch (error) {
      console.error(error)
    }
    setSelectedRecipe(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const handleCreate = async (recipe: TransformedRecipes) => {
    const data = {
      steps: recipe.steps,
      name: recipe.name,
      recommendations: recipe.recommendations,
      supplies: recipe.supplies,
      standardUnits: Number(recipe.standardUnits),
    }

    try {
      const res = await request<any[]>({
        path: '/recipes',
        method: 'POST',
        data,
      })
      if (res) {
        getRecipes()
      }
    } catch (error) {
      console.error(error)
    }
    setIsCreateMode(false)
  }

  const getRecipes = async () => {
    try {
      const res = await request<RecipesResponse[]>({
        path: '/recipes',
        method: 'GET',
      })
      if (res) {
        console.log(res);
        const transformedData = transformUserData(res)
        setRecipes(transformedData)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const transformUserData = (data: RecipesResponse[]): TransformedRecipes[] => {
    return data.map((recipe) => ({
      ...recipe,
      author: capitalizeFullName(recipe.author.fullname),
      createdAt: formatDate(recipe.createdAt),
      updatedAt: formatDate(recipe.updatedAt),
    }))
  }

  useEffect(() => {
    getRecipes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      <RecipeDialogEdit
        recipe={selectedRecipe}
        onClose={onClose}
        editable={isEditMode}
        onSave={handleSave}
        supplies={supplies}
      />
      <RecipeDialogCreate
        open={isCreateMode}
        onClose={onClose}
        onSave={handleCreate}
        supplies={supplies}
      />
      <DownloadPdfButton url='http://localhost:3000/recipes/generate-pdf'/>
    </div>
  )
}
