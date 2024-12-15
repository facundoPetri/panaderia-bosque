import { useState, useEffect, useMemo } from 'react'
import GenericTable from '../../components/GenericTable'
import { Column } from '../../components/GenericTable'
import { ToastContainer } from 'react-toastify'
import { RecipesResponse } from '../../interfaces/Recipes'
import { request, requestToast } from '../../common/request'
import ProductionEfficienciesDialog from './ProductionEfficienciesDialog' // Importa el modal correctamente
import { MachinesResponse } from '../../interfaces/Machines'
import { UsersResponse } from '../../interfaces/Users'
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import GenericDialog from '../../components/GenericDIalog'
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

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
  comments: string
}

const dropdownOptions = columns
  .filter((column) => !column.hiddenFilter)
  .map((column) => ({
    title: column.label,
  }))
interface Data {
  number: number
  cantidad: number
  tiempoTotal: number
}
export default function ProductionEfficiencies() {
  const [selectedProductionEfficiency, setSelectedProductionEfficiency] =
    useState<ProductionEfficiency | null>(null)
  const [recipes, setRecipes] = useState<RecipesResponse[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<string>(
    ''
  )
  const [openCompareDialog, setOpenCompareDialog] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [productionLogs, setProductionLogs] = useState<any[]>([])
  const [data, setData] = useState<Data[]>([])
  const [selectedItemsToCompare, setSelectedItemsToCompare] = useState<
    ProductionEfficiency[]
  >([])
  const [transformedProductionLogs, setTransformedProductionLogs] = useState<
    any[]
  >([])
  // Modal: Ver o editar
  const onView = (productionEfficiency: ProductionEfficiency) => {
    const selected = productionLogs.find(
      (r) => r._id === productionEfficiency._id
    )
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
          recipe: production.recipe.name,
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
  const handleOpenCompare = () => {
    setOpenCompareDialog(true)
  }
  const handleCloseCompareDialog = () => {
    setOpenCompareDialog(false)
    setData([])
    setShowChart(false)
    setSelectedItemsToCompare([])
    setSelectedRecipe('')
  }
  const handleCompare = () => {
    setShowChart(true)
    const newData = selectedItemsToCompare.map((production) => ({
      number: production.number,
      cantidad: production.quantity,
      tiempoTotal: production.total_time,
    }))
    setData(newData)
  }
  const handleBarClick = (item:any,index:number)=>{
    const selectedItem = productionLogs.find((pro)=>pro.number === item.number)
    if(selectedItem){
      onView(selectedItem)
    }
  }
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
        customButton={
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCompare}
            style={{ marginLeft: '1rem' }}
          >
            Comparar informes
          </Button>
        }
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
      {openCompareDialog && (
        <GenericDialog
          title="Comparar informes"
          open={openCompareDialog}
          fullWidth
          customWidth="lg"
          handleClose={handleCloseCompareDialog}
          content={
            <div>
              <Typography>Elige una receta</Typography>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="recipe-select-label">Receta</InputLabel>
                <Select
                  labelId="recipe-select-label"
                  value={selectedRecipe}
                  onChange={(e) => setSelectedRecipe(e.target.value as string)}
                  label="Receta"
                >
                  {recipes.map((recipe) => (
                    <MenuItem key={recipe._id} value={recipe._id}>
                      {recipe.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography>Elige al menos 2 informes para comparar</Typography>
              {selectedRecipe &&
                productionLogs
                  .filter(
                    (pro: ProductionEfficiency) =>
                      pro.recipe._id === selectedRecipe
                  )
                  .map((production: ProductionEfficiency) => (
                    <div
                      key={production._id}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Checkbox
                        size="small"
                        checked={
                          Boolean(
                            selectedItemsToCompare.find(
                              (item) => item._id === production._id
                            )
                          ) || false
                        }
                        onChange={(e, checked) =>
                          setSelectedItemsToCompare((prev) => {
                            if (checked) {
                              return [...prev, production]
                            }
                            return [
                              ...prev.filter(
                                (item) => item._id !== production._id
                              ),
                            ]
                          })
                        }
                      />
                      <p>Informe {production.number}</p>
                    </div>
                  ))}
              <div style={{ marginBottom: '1rem' }}>
                {selectedItemsToCompare.length > 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCompare}
                    style={{ marginLeft: '1rem' }}
                  >
                    Comparar
                  </Button>
                )}
              </div>
              {showChart && data.length > 0 && (
                <BarChart
                  width={600}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={(entry) => `Informe ${entry.number}`} />
                  {/* Eje Y para la cantidad */}
                  <YAxis yAxisId="left" orientation="left" />
                  {/* Eje Y para el tiempo total */}
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />

                  {/* Barra para la cantidad fabricada */}
                  <Bar
                    yAxisId="left"
                    dataKey="cantidad"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                    onClick={handleBarClick}
                  />
                  {/* Barra para el tiempo total */}
                  <Bar
                    yAxisId="right"
                    dataKey="tiempoTotal"
                    fill="#82ca9d"
                    activeBar={<Rectangle fill="gold" stroke="purple" />}
                    onClick={handleBarClick}
                  />
                </BarChart>
              )}
            </div>
          }
          primaryButtonTitle="Cerrar"
          primaryButtonAction={handleCloseCompareDialog}
        />
      )}
      <ToastContainer />
    </div>
  )
}
