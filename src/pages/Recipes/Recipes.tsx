import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GenericTable from '../../components/GenericTable'
import RecipeDialogEdit from './RecipeDialogEdit'
import RecipeDialogCreate from './RecipeDialogCreate'
import { Column } from '../../components/GenericTable'
import { RecipesResponse, TransformedRecipes } from '../../interfaces/Recipes'
import { request, requestToast } from '../../common/request'
import { formatISODateString } from '../../utils/dateUtils'
import { SuppliesResponse } from '../../interfaces/Supplies'
import { capitalizeFullName } from '../../utils/capitalizeFullName'
import DownloadPdfButton from '../../components/DownloadPdfButton'
import { API_BASE_URL } from '../../common/commonConsts'
import { toast } from 'react-toastify';

const columns: Column<TransformedRecipes>[] = [
  {
    id: '_id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'name', label: 'Nombre' },
  { id: 'supplies', label: 'Ingredientes', sortable: false },
  { id: 'author', label: 'Autor' },
  { id: 'createdAt', label: 'Fecha de creación' },
  { id: 'updatedAt', label: 'Fecha de modificación' },
]

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipesResponse | null>(
    null
  )
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
  const [recipes, setRecipes] = useState<RecipesResponse[]>([])
  const [transformedRecipes, setTransformedRecipes] = useState<
    TransformedRecipes[]
  >([])
  const userType = sessionStorage.getItem('userType')

  const onView = (recipe: TransformedRecipes) => {
    const selected = recipes.find((r) => r._id === recipe._id)
    if (selected) {
      setSelectedRecipe(selected)
    }
    setIsEditMode(false)
  }

  const onClose = () => {
    setSelectedRecipe(null)
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const onDelete = async (id: string) => {
    try {
      const res = await requestToast<any[]>({
        path: `/recipes/${id}`,
        method: 'DELETE',
        successMessage: 'Receta eliminada',
        errorMessage: 'Error al eliminar receta',
        pendingMessage: 'Eliminando receta...',
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
    const selected = recipes.find((r) => r._id === recipe._id)
    if (selected) {
      setSelectedRecipe(selected)
    }
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

  const handleSave = async (recipe: RecipesResponse) => {
    //author and supplies, not working
    const data = {
      steps: recipe.steps,
      name: recipe.name,
      recommendations: recipe.recommendations,
      supplies: recipe.supplies.map((sup) => sup._id),
      standardUnits: Number(recipe.standardUnits),
    }

    try {
      const res = await requestToast<any[]>({
        path: `/recipes/${recipe._id}`,
        method: 'PATCH',
        data,
        successMessage: 'Receta actualizada',
        errorMessage: 'Error al actualizar receta',
        pendingMessage: 'Actualizando receta...',
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
      const res = await requestToast<any[]>({
        path: '/recipes',
        method: 'POST',
        data,
        successMessage: 'Receta creada',
        errorMessage: 'Error al crear receta',
        pendingMessage: 'Creando receta...',
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
        const transformedData = transformUserData(res)
        setRecipes(res)
        setTransformedRecipes(transformedData)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const transformUserData = (data: RecipesResponse[]): TransformedRecipes[] => {
    return data.map((recipe) => ({
      ...recipe,
      author: capitalizeFullName(recipe.author.fullname),
      createdAt: formatISODateString(recipe.createdAt),
      updatedAt: formatISODateString(recipe.updatedAt),
      supplies: recipe.supplies
        .map((supply: SuppliesResponse) => supply.name)
        .map((str) => str)
        .join(', '),
      state: true,
    }))
  }

  useEffect(() => {
    toast.promise(Promise.all([getRecipes(), getSupplies()]), {
      pending: 'Cargando recetas...',
      success: 'Recetas cargadas',
      error: 'Error al cargar recetas',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consultar recetas</h1>
      <GenericTable
        columns={columns}
        data={transformedRecipes}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        nameColumnId="name"
        disableCreate={userType === 'user'}
        disableEdit={userType === 'user'}
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
      <ToastContainer />
      <DownloadPdfButton url={`${API_BASE_URL}/recipes/generate-pdf`} />
    </div>
  )
}
