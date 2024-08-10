import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import { SuppliesResponse } from '../../interfaces/Supplies';
import { request } from '../../common/request';
import { formatDate } from '../../utils/dateUtils';
import SuppliesDialogEdit from './SuppliesDialogEdit';

const columns: Column<SuppliesResponse>[] = [
  {
    id: '_id',
    label: 'id',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'deletedAt', label: 'Fecha de vencimiento' },
  { id: 'name', label: 'Nombre' },
  { id: 'max_stock', label: 'Numero de lote' },
  { id: 'description', label: 'Ubicacion' },
  { id: 'unit', label: 'Cantidad' },
];
//TODO: VER bien por que no esta en el back
const dropdownOptions = columns.map(column => ({
  title: column.label,
}));

export default function ExpiringSupply() {
  const [selectedSupplies, setSelectedSupplies] =
    useState<SuppliesResponse | null>(null)
    const [supplies, setSupplies] = useState<SuppliesResponse[]>([])
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
  //Modal
  const onView = (supplies: SuppliesResponse) => {
    setSelectedSupplies(supplies)
    setIsEditMode(false)
  }

  const onClose = () => {
    setSelectedSupplies(null)
    setIsEditMode(false)
  }

  const onDelete = (id: string) => {
    console.log(`Eliminando elemento con id: ${id}`);
    // Aquí puedes llamar a tu servicio de eliminación con el id
  };

  const getSupplies = async () => {
    try {
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
      })
      if (res) {
        const formattedSupplies = res.map((supplie) => ({
          ...supplie,
          updatedAt: formatDate(supplie.updatedAt),
        }))
        setSupplies(formattedSupplies)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getSupplies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div style={{ padding: '20px' }}>
      <h1>Insumos con vencimiento próximo</h1>
      <GenericTable
        columns={columns}
        data={supplies}
        dropdownOptions={dropdownOptions} // Agrege dropdownOptions
        onView={onView}
        onDelete={onDelete}
        showDropdown={false}
        nameColumnId="name"
      />
      <SuppliesDialogEdit
        selectedSupplies={selectedSupplies}
        onClose={onClose}
        editable={isEditMode}
      />
    </div>
  );
}