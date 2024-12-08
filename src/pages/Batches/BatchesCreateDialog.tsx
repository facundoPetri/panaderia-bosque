import React, { useState } from "react";
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
import { BatchCreateData } from "../../interfaces/Batch";
import { SuppliesResponse } from "../../interfaces/Supplies";
import {
  validateDate,
  validateSpecificNumber,
  validateText,
} from "../../utils/validateData";

interface BatchesDialogCreateProps {
  open: boolean;
  onClose: () => void;
  onSave: (batch: BatchCreateData) => void;
  supplies: SuppliesResponse[];
}

const BatchesCreateDialog: React.FC<BatchesDialogCreateProps> = ({
  open,
  onClose,
  onSave,
  supplies,
}) => {
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const [batchNumber, setBatchNumber] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [dateOfEntry, setDateOfEntry] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [supplyId, setSupplyId] = useState("");

  const validateForm = (): boolean => {
    const isSuplyValid = validateText(supplyId, { required: true }, "Insumo");
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

    const newBatch: BatchCreateData = {
      row,
      column,
      batch_number: batchNumber,
      quantity,
      expiration_date: expirationDate?.toISOString() || "",
      date_of_entry: dateOfEntry?.toISOString() || "",
      supply_id: supplyId,
    };

    onSave(newBatch);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar lote de insumo</DialogTitle>
      <DialogContent>
        <TextField
          id="insumo"
          select
          label="Insumo"
          value={supplyId}
          fullWidth
          onChange={(e) => setSupplyId(e.target.value)}
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
        />
        <TextField
          margin="dense"
          label="Lote"
          type="number"
          fullWidth
          value={batchNumber}
          onChange={(e) => setBatchNumber(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Fila"
          type="number"
          fullWidth
          value={row}
          onChange={(e) => setRow(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Columna"
          type="number"
          fullWidth
          value={column}
          onChange={(e) => setColumn(Number(e.target.value))}
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
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            required
          />
          <KeyboardDatePicker
            label="Fecha de expiración"
            format="dd/MM/yyyy"
            value={expirationDate}
            onChange={(date) => setExpirationDate(date)}
            fullWidth
            inputVariant="outlined"
            margin="normal"
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            required
          />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BatchesCreateDialog;
