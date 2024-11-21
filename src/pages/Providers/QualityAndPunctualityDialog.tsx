import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Grid,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { ProviderResponse } from "../../interfaces/Providers";
import { UsersResponse } from "../../interfaces/Users";


interface ReportModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    providers: ProviderResponse[];
    employees: UsersResponse[];
}

const QAndPDialog: React.FC<ReportModalProps> = ({
    open,
    onClose,
    onSave,
    providers,
    employees,
}) => {
    const [selectedProvider, setSelectedProvider] = useState<string>("");
    const [selectedSupply, setSelectedSupply] = useState<string>("");
    const [reportName, setReportName] = useState<string>("");
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [supplyDetails, setSupplyDetails] = useState<string>("");
    const [reportDate, setReportDate] = useState<Date | null>(new Date());
    const [orderDate, setOrderDate] = useState<Date | null>(new Date());
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(new Date());

    const supplies = providers.find((p) => p._id === selectedProvider)?.supplies || [];

    const handleSave = () => {
        const data = {
            reportName,
            selectedProvider,
            selectedEmployee,
            supplyDetails,
            selectedSupply,
            reportDate,
            orderDate,
            deliveryDate,
        };
        onSave(data);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Reporte de reposición</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Proveedor"
                            select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            fullWidth
                            variant="outlined"
                        >
                            {providers.map((provider) => (
                                <MenuItem key={provider._id} value={provider._id}>
                                    {provider.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Empleado que reporta"
                            select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            fullWidth
                            variant="outlined"
                        >
                            {employees.map((employee) => (
                                <MenuItem key={employee._id} value={employee._id}>
                                    {employee.fullname}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Detalle del insumo"
                            value={supplyDetails}
                            onChange={(e) => setSupplyDetails(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Insumo"
                            select
                            value={selectedSupply}
                            onChange={(e) => setSelectedSupply(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled={!supplies.length}
                        >
                            {supplies.map((supply) => (
                                <MenuItem key={supply._id} value={supply._id}>
                                    {supply.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <KeyboardDatePicker
                            label="Fecha de reporte"
                            value={reportDate}
                            onChange={setReportDate}
                            format="dd/MM/yyyy"
                            fullWidth
                            inputVariant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <KeyboardDatePicker
                            label="Fecha de pedido"
                            value={orderDate}
                            onChange={setOrderDate}
                            format="dd/MM/yyyy"
                            fullWidth
                            inputVariant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <KeyboardDatePicker
                            label="Fecha de entrega"
                            value={deliveryDate}
                            onChange={setDeliveryDate}
                            format="dd/MM/yyyy"
                            fullWidth
                            inputVariant="outlined"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                    Cerrar
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default QAndPDialog;
