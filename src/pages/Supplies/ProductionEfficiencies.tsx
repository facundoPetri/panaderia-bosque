import { useState, useEffect } from 'react'
import GenericTable from '../../components/GenericTable'
import { Column } from '../../components/GenericTable'
import { ToastContainer } from 'react-toastify'
import { RecipesResponse } from '../../interfaces/Recipes'
import { request, requestToast } from '../../common/request'
import ProductionEfficienciesDialog from './ProductionEfficienciesDialog' // Importa el modal correctamente
import { MachinesResponse } from '../../interfaces/Machines'
import { UsersResponse } from '../../interfaces/Users'

const columns: Column<ProductionEfficiency>[] = [
  { id: '_id', label: 'id', hiddenColumn: true, sortable: false },
  { id: 'number', label: 'Informe' },
  { id: 'recipe', label: 'Recipe' },
  { id: 'quantity', label: 'Cantidad' },
  { id: 'total_time', label: 'Tiempo total' },
]

export interface ProductionEfficiency {
  _id: string
  number: number
  quantity: number
  total_time: number
  final_date: string
  inital_date: string
  equipment: MachinesResponse[]
  recipe: RecipesResponse
  user: UsersResponse
  comments:string
}

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))

export default function ProductionEfficiencies() {
  const [selectedProductionEfficiency, setSelectedProductionEfficiency] =
    useState<ProductionEfficiency | null>(null)
  const [recipes, setRecipes] = useState<RecipesResponse[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productionLogs, setProductionLogs] = useState<any[]>([])
  const [transformedProductionLogs, setTransformedProductionLogs] = useState<any[]>([])


  // Modal: Ver o editar
  const onView = (productionEfficiency: ProductionEfficiency) => {
    const selected = productionLogs.find((r) => r._id === productionEfficiency._id)
    if (selected) {
      setSelectedProductionEfficiency(selected)
    }
    setIsDialogOpen(true)
  }

  const onClose = () => {
    setIsDialogOpen(false)
    setSelectedProductionEfficiency(null)
  }
  const onSave = async (data: any) => {
    try {
      const res = await requestToast<any[]>({
        path: '/production',
        method: 'POST',
        data: data,
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
    setIsDialogOpen(false)
  }

  const onDelete = (id: string) => {
    console.log(`Eliminando elemento con id: ${id}`)
    // Aquí puedes llamar a tu servicio de eliminación con el id
  }

  const onAdd = () => {
    setSelectedProductionEfficiency(null)
    setIsDialogOpen(true)
  }

  const getRecipes = async () => {
    try {
      const res = await request<RecipesResponse[]>({
        path: '/recipes',
        method: 'GET',
      })
      if (res) {
        setRecipes(res)
      }
    } catch (error) {
      console.error('Error al cargar recetas:', error)
    }
  }
  const getProduction = async () => {
    try {
      const res = await request<any[]>({
        path: '/production',
        method: 'GET',
      })
      if (res) {
        const formattedProduction = res.map((production) => ({
          ...production,
          recipe:production.recipe.name
        }))
        setProductionLogs(res)
        setTransformedProductionLogs(formattedProduction)
      }
    } catch (error) {
      console.error('Error al cargar recetas:', error)
    }
  }
  useEffect(() => {
    getRecipes()
    getProduction()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Rendimiento de producción</h1>
      <GenericTable
        columns={columns}
        data={transformedProductionLogs}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        showDropdown={false}
        nameColumnId="_id"
        nameButton="Crear informe"
      />
      {isDialogOpen && (
        <ProductionEfficienciesDialog
          open={isDialogOpen}
          onClose={onClose}
          onSave={onSave}
          recipes={recipes}
          selectedProductionEfficiency={selectedProductionEfficiency}
        />
      )}
      <ToastContainer />
    </div>
  )
}
