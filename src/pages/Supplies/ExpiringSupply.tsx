import { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { Column } from '../../components/GenericTable';
import { SuppliesResponse, TransformedBatch } from '../../interfaces/Supplies';
import { request } from '../../common/request';
import { formatDate } from '../../utils/dateUtils';
import SuppliesDialogEdit from './SuppliesDialogEdit';

const columns: Column<TransformedBatch>[] = [
  {
    id: '_id',
    label: 'ID',
    hiddenColumn: true,
    sortable: false,
    hiddenFilter: true,
  },
  { id: 'expiration_date', label: 'Fecha de vencimiento', sortable: true },
  { id: 'supply_name', label: 'Nombre del insumo', sortable: true },
  { id: 'batch_number', label: 'Número de lote' },
  { id: 'location', label: 'Ubicación' },
  { id: 'quantity', label: 'Cantidad', sortable: true },
];

const dropdownOptions = columns
  .filter(column => !column.hiddenFilter)
  .map(column => ({
    title: column.label,
  }));

export default function ExpiringSupply() {
  const [supplies, setSupplies] = useState<SuppliesResponse[]>([]);
  const [, setSelectedBatch] = useState<TransformedBatch | null>(null);
  const [selectedSupplies, setSelectedSupplies] = useState<SuppliesResponse | null>(null);
  const [batches, setBatches] = useState<TransformedBatch[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const onView = (batch: TransformedBatch) => {
    setSelectedBatch(batch);
    setIsEditMode(false);

    const relatedSupply = supplies.find(supply => supply.name === batch.supply_name);
    setSelectedSupplies(relatedSupply || null);
  };

  const onClose = () => {
    setSelectedBatch(null);
    setSelectedSupplies(null);
    setIsEditMode(false);
  };

  const onDelete = (id: string) => {
    // Aquí puedes manejar la lógica para eliminar el lote con el ID proporcionado
  };

  const getSupplies = async () => {
    try {
      const res = await request<SuppliesResponse[]>({
        path: '/supplies',
        method: 'GET',
      });

      if (res) {
        setSupplies(res);
        const transformedBatches: TransformedBatch[] = res.flatMap(supply =>
          (supply.batches || []).map(batch => ({
            ...batch,
            location: ('Fila: ' + batch.row + ', Columna: ' + batch.column),
            supply_name: supply.name,
            expiration_date: formatDate(batch.expiration_date),
            quantity: (batch.quantity + ' ' +supply.unit)
          }))
        );

        setBatches(transformedBatches);
      }
    } catch (error) {
      console.error('Error al obtener los insumos:', error);
    }
  };

  useEffect(() => {
    getSupplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Insumos con vencimiento próximo</h1>
      <GenericTable
        columns={columns}
        data={batches}
        dropdownOptions={dropdownOptions}
        onView={onView}
        onDelete={onDelete}
        showDropdown={false}
        nameColumnId="batch_number"
      />
      {selectedSupplies && (
        <SuppliesDialogEdit
          selectedSupplies={selectedSupplies}
          onClose={onClose}
          editable={isEditMode}
        />
      )}
    </div>
  );
}