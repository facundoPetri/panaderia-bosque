import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import { Batch } from "../../interfaces/Batch";
import { SuppliesResponse } from "../../interfaces/Supplies";
import {
  validateDate,
  validateSpecificNumber,
  validateText,
} from "../../utils/validateData";

interface BatchesEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (batch: Batch) => void;
  supplies: SuppliesResponse[];
  selectedBatch: Batch | null;
  editable: boolean;
}

const BatchesEditDialog: React.FC<BatchesEditDialogProps> = ({
  open,
  onClose,
  onSave,
  supplies,
  selectedBatch,
  editable,
}) => {
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const [batchNumber, setBatchNumber] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [dateOfEntry, setDateOfEntry] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [supplyId, setSupplyId] = useState<SuppliesResponse | null>(null);

  useEffect(() => {
    if (selectedBatch) {
      setRow(selectedBatch.row);
      setColumn(selectedBatch.column);
      setBatchNumber(selectedBatch.batch_number);
      setQuantity(selectedBatch.quantity);
      setDateOfEntry(new Date(selectedBatch.date_of_entry));
      setExpirationDate(new Date(selectedBatch.expiration_date));
      setSupplyId(selectedBatch.supply_id || null);
    }
  }, [selectedBatch]);

  const validateForm = (): boolean => {
    const isSuplyValid = validateText(supplyId?._id || "", { required: true }, "Insumo");
    const isRowValid = validateSpecificNumber(row, { min: 1 }, "Fila");
    const isColumnValid = validateSpecificNumber(column, { min: 1 }, "Columna");
    const isBatchNumberValid = validateSpecificNumber(batchNumber, { min: 1 }, "Lote");
    const isQuantityValid = validateSpecificNumber(quantity, { min: 1 }, "Cantidad");
    const areDatesValid = validateDate(dateOfEntry, expirationDate);

    return (
      isSuplyValid &&
      isRowValid &&
      isColumnValid &&
      isBatchNumberValid &&
      isQuantityValid &&
      areDatesValid
    );
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedBatch: Batch = {
      _id: selectedBatch?._id || "",
      row,
      column,
      batch_number: batchNumber,
      quantity,
      expiration_date: expirationDate?.toISOString() || "",
      date_of_entry: dateOfEntry?.toISOString() || "",
      supply_id: supplyId,
    };

    onSave(updatedBatch);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editable ? "Editar lote de insumo" : "Detalle del lote de insumo"}</DialogTitle>
      <DialogContent>
        <TextField
          id="insumo"
          select
          label="Insumo"
          value={supplyId?._id || ""}
          fullWidth
          onChange={(e) => {
            const selectedSupply = supplies.find(supply => supply._id === e.target.value);
            setSupplyId(selectedSupply || null);
          }}
          InputProps={{
            readOnly: !editable, // Deshabilita el campo si no está en modo edición
          }}
        >
          {supplies.map((supply) => (
            <MenuItem key={supply._id} value={supply._id}>
              {supply.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Cantidad"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          InputProps={{
            readOnly: !editable, // Deshabilita el campo si no está en modo edición
          }}
        />
        <TextField
          margin="dense"
          label="Lote"
          type="number"
          fullWidth
          value={batchNumber}
          onChange={(e) => setBatchNumber(Number(e.target.value))}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <TextField
          margin="dense"
          label="Fila"
          type="number"
          fullWidth
          value={row}
          onChange={(e) => setRow(Number(e.target.value))}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <TextField
          margin="dense"
          label="Columna"
          type="number"
          fullWidth
          value={column}
          onChange={(e) => setColumn(Number(e.target.value))}
          InputProps={{
            readOnly: !editable,
          }}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
          <KeyboardDatePicker
            label="Fecha de ingreso"
            format="dd/MM/yyyy"
            value={dateOfEntry}
            onChange={(date) => setDateOfEntry(date)}
            fullWidth
            inputVariant="outlined"
            margin="normal"
            InputProps={{
              readOnly: !editable,
            }}
          />
          <KeyboardDatePicker
            label="Fecha de expiración"
            format="dd/MM/yyyy"
            value={expirationDate}
            onChange={(date) => setExpirationDate(date)}
            fullWidth
            inputVariant="outlined"
            margin="normal"
            InputProps={{
              readOnly: !editable,
            }}
          />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        {editable && (
          <Button onClick={handleSave} color="primary" variant="contained">
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BatchesEditDialog;
