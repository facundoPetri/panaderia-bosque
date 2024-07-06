import { useState } from 'react';
import GenericTable from '../components/GenericTable';
import { Column } from '../components/GenericTable';
import SuppliesDialog from '../components/SuppliesDialog';

interface StockItem {
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
  { id: 'name', label: 'Nombre' },
  { id: 'lastLoadDate', label: 'Fecha de ultima carga' },
  { id: 'currentStock', label: 'Stock actual' },
  { id: 'description', label: 'Descripción' },
];


const data: StockItem[] = [
  {
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

const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function Supplies() {
  const [selectedSupplies, setSelectedSupplies] = useState<StockItem | null>(null);
  //Modal
  const handleView = (supplies: StockItem) => {
    setSelectedSupplies(supplies);
  };

  const handleClose = () => {
    setSelectedSupplies(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Consulta de insumos</h1>
      <GenericTable
        columns={columns}
        data={data}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={handleView}
      />
       <SuppliesDialog
        open={selectedSupplies !== null}
        handleClose={handleClose}
        stockItem={selectedSupplies}
      />
    </div>
  );
}
