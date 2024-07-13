import { useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import SuppliesDialogEdit from './SuppliesDialogEdit';
export interface StockItem {
  id: string;
  name: string;
  lastLoadDate: string;
  currentStock: string;
  description: string;
  usedIn: string;
  packageSize: number;
  unit: string;
  lot1: number;
  lot2: number;
  expirationDate: string;
  minStock: number;
  maxStock: number;
  imageUrl: string;
}


const columns: Column<StockItem>[] = [
  { id: 'id', label: 'id', hiddenColumn: true, sortable: false, hiddenFilter: true },
  { id: 'name', label: 'Nombre' },
  { id: 'lastLoadDate', label: 'Fecha de ultima carga', hiddenFilter: true },
  { id: 'currentStock', label: 'Stock actual', hiddenFilter: true },
  { id: 'description', label: 'Descripción', hiddenFilter: true },
];


const data: StockItem[] = [
  {
    id: '1',
    name: "Harina de trigo 000",
    lastLoadDate: "12/06/2023",
    currentStock: "5 kg",
    description: "Paquete de 1kg c/u, de harina de trigo 000 marca Pureza.",
    usedIn: "Pan francés, Media luna, Criollo Común, Criollo hojaldre",
    packageSize: 1,
    unit: "kg",
    lot1: 2,
    lot2: 3,
    expirationDate: "12/11/2023",
    minStock: 5,
    maxStock: 40,
    imageUrl: "https://d3340tyzmtlo4u.cloudfront.net/users/864/images/detailed/13/Favorita_Harina_de_Trigo_Enriquecida_Tipo_000,_1_kg.webp" // URL de la imagen del producto
  },
  {
    id: '2',
    name: "Harina 000",
    lastLoadDate: "20/06/2022",
    currentStock: "100 kg",
    description: "Paquete de 20kg c/u, de harina de trigo 000",
    usedIn: "Pan francés, Media luna, Criollo Común, Criollo hojaldre",
    packageSize: 1,
    unit: "kg",
    lot1: 2,
    lot2: 3,
    expirationDate: "12/11/2023",
    minStock: 5,
    maxStock: 40,
    imageUrl: "https://example.com/image.jpg"
  },
  {
    id: '3',
    name: "Huevo",
    lastLoadDate: "20/06/2022",
    currentStock: "46 unidades",
    description: "Maple de 30 huevos",
    usedIn: "Pan francés, Media luna, Criollo Común, Criollo hojaldre",
    packageSize: 1,
    unit: "kg",
    lot1: 2,
    lot2: 3,
    expirationDate: "12/11/2023",
    minStock: 5,
    maxStock: 40,
    imageUrl: "https://example.com/image.jpg"
  },
  {
    id: '4',
    name: "Levadura en polvo",
    lastLoadDate: "15/06/2022",
    currentStock: "10 unidades",
    description: "Paquete de 200gr c/u de levadura",
    usedIn: "Pan francés, Media luna, Criollo Común, Criollo hojaldre",
    packageSize: 1,
    unit: "kg",
    lot1: 2,
    lot2: 3,
    expirationDate: "12/11/2023",
    minStock: 5,
    maxStock: 40,
    imageUrl: "https://example.com/image.jpg"
  },
  {
    id: '5',
    name: "Margarina",
    lastLoadDate: "10/06/2022",
    currentStock: "15 kg",
    description: "Paquete de 5 kg c/u",
    usedIn: "Pan francés, Media luna, Criollo Común, Criollo hojaldre",
    packageSize: 1,
    unit: "kg",
    lot1: 2,
    lot2: 3,
    expirationDate: "12/11/2023",
    minStock: 5,
    maxStock: 40,
    imageUrl: "https://example.com/image.jpg"
  },
  {
    id: '6',
    name: "Sal fina",
    lastLoadDate: "22/06/2022",
    currentStock: "20 kg",
    description: "Paquetes de 5kg c/u de sal fina",
    usedIn: "Pan francés, Media luna, Criollo Común, Criollo hojaldre",
    packageSize: 1,
    unit: "kg",
    lot1: 2,
    lot2: 3,
    expirationDate: "12/11/2023",
    minStock: 5,
    maxStock: 40,
    imageUrl: "https://example.com/image.jpg"
  }
];

const dropdownOptions = columns
  .filter(column => column.hiddenFilter !== true)
  .map(column => ({
    title: column.label,
  }));

export default function Supplies() {
  const [selectedSupplies, setSelectedSupplies] = useState<StockItem | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);

  const onView = (supplies: StockItem) => {
    setSelectedSupplies(supplies);
    setIsEditMode(false);
  };

  const onClose = () => {
    setSelectedSupplies(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const onDelete = (id: number) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const onAdd = () => {
    setIsCreateMode(true);
  };

  const handleEdit = (supplies: StockItem) => {
    setSelectedSupplies(supplies);
    setIsEditMode(true);
  };

  const handleSave = (supplies: StockItem) => {
    console.log('Guardando cambios', supplies);
    // Aquí puedes manejar la lógica para guardar los cambios del usuario
    setSelectedSupplies(null);
    setIsEditMode(false);
    setIsCreateMode(false);
  };

  const handleCreate = (supplies: any) => {
    console.log('Creando usuario', supplies);
    // Aquí puedes manejar la lógica para crear un nuevo usuario
    setIsCreateMode(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de insumos</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={onView}
        onDelete={onDelete}
        onAdd={onAdd}
        onEdit={handleEdit}
        nameColumnId="name"
      />
      <SuppliesDialogEdit stockItem={selectedSupplies} onClose={onClose} editable={isEditMode} onSave={handleSave} />
    </div>
  );
}
