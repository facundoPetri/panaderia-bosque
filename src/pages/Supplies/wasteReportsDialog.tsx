import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UsersResponse } from "../../interfaces/Users";
import { WasteFormData, WasteResponse } from "../../interfaces/Waste";
import { SuppliesResponse } from "../../interfaces/Supplies";

interface WasteEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: WasteFormData, id?: string) => void;
  users: UsersResponse[];
  supplies: SuppliesResponse[];
  formData: WasteResponse | null;
}

const mapper = (selected: WasteResponse) => ({
  reporter: {
    name: selected.reporter.fullname,
    id: selected.reporter._id,
  },
  involved: {
    name: selected.responsible?.fullname ?? "",
    id: selected.responsible?._id ?? "",
  },
  date: new Date(selected.date),
  reason: selected.motive,
  items: selected.supplies.map((supply) => ({
    supply: supply.supplyId.name,
    supplyId: supply.supplyId._id,
    quantity: supply.quantity.toString(),
  })),
})

const WasteReportDialog: React.FC<WasteEditDialogProps> = ({
  open,
  onClose,
  onSave,
  users,
  supplies,
  formData: edit,
}) => {
  const [formData, setFormData] = useState<WasteFormData>(edit ? mapper(edit) : {
    reporter: { name: "", id: "" },
    involved: { name: "", id: "" },
    date: null,
    reason: "",
    items: [],
  });

  const handleFieldChange = (
    field: keyof WasteFormData,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (formData.items.length >= 5) return; // Limitar a 5 insumos
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { supply: "", supplyId: "", quantity: "" }],
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof { supply: string; supplyId: string; quantity: string },
    value: string
  ) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    handleFieldChange("items", updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    handleFieldChange("items", updatedItems);
  };

  const handleSave = () => {
    onSave(formData, edit?._id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{edit ? 'Edición de desperdicio' : 'Creación de desperdicio'}</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Empleado que reporta"
          fullWidth
          margin="normal"
          value={formData.reporter.id}
          onChange={(e) => {
            const selectedUser = users.find(user => user._id === e.target.value);
            handleFieldChange("reporter", { name: selectedUser?.fullname || "", id: e.target.value });
          }}
        >
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.fullname}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Empleado involucrado"
          fullWidth
          margin="normal"
          value={formData.involved.id}
          onChange={(e) => {
            const selectedUser = users.find(user => user._id === e.target.value);
            handleFieldChange("involved", { name: selectedUser?.fullname || "", id: e.target.value });
          }}
        >
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.fullname}
            </MenuItem>
          ))}
        </TextField>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
          <KeyboardDatePicker
            label="Fecha de reporte"
            format="dd/MM/yyyy"
            value={formData.date}
            onChange={(date) => handleFieldChange("date", date)}
            fullWidth
            inputVariant="outlined"
            margin="normal"
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <TextField
          label="Motivo"
          fullWidth
          margin="normal"
          value={formData.reason}
          onChange={(e) => handleFieldChange("reason", e.target.value)}
        />
        {formData.items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <TextField
              select
              label={`Insumo ${index + 1}`}
              fullWidth
              value={item.supplyId}
              onChange={(e) => {
                handleItemChange(index, "supplyId", e.target.value)
              }}
              disabled={edit !== null}
            >
              {supplies.map((supply) => (
                <MenuItem key={supply._id} value={supply._id}>
                  {supply.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cantidad"
              fullWidth
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              disabled={edit !== null}
            />
            <IconButton onClick={() => handleRemoveItem(index)} disabled={edit !== null}>
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </div>
        ))}
        <Button
          variant="outlined"
          onClick={handleAddItem}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          disabled={formData.items.length >= 5 || edit !== null}
        >
          Agregar Insumo
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WasteReportDialog;
