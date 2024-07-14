import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  TableSortLabel,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import CheckboxDropdown from './DDLCheckBox';

interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
  hiddenColumn?: boolean;
  hiddenFilter?: boolean;
}

interface GenericTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  onView: (row: T) => void;
  onAdd?: () => void;
  onEdit?: (row: T) => void; // Nueva función onEdit
  onDelete: (id: number) => void;
  dropdownOptions: { title: string }[];
  showDropdown?: boolean;
  nameColumnId: keyof T;
}

const useStyles = makeStyles({
  tableBody: {
    backgroundColor: '#BEBEBE',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px',
  },
});

const GenericTable = <T extends object>({
  columns,
  data,
  onView,
  onAdd,
  onEdit,
  onDelete,
  dropdownOptions,
  showDropdown = true,
  nameColumnId,
}: GenericTableProps<T>) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [selectedOption, setSelectedOption] = useState<{ title: string } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const handleRequestSort = useCallback((property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [orderBy, order]);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const stableSort = useCallback((array: T[], comparator: (a: T, b: T) => number) => {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }, []);

  const getComparator = useCallback(<Key extends keyof any>(
    order: 'asc' | 'desc',
    orderBy: Key
  ): ((a: { [key in Key]: any }, b: { [key in Key]: any }) => number) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }, []);

  const descendingComparator = useCallback(<T,>(a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }, []);

  const filteredData = useMemo(() => data.filter((row) => {
    const matchesDropdown = !selectedOption || columns.some(col => col.label === selectedOption.title && String(row[col.id]).toLowerCase().includes(searchText.toLowerCase()));
    return matchesDropdown;
  }), [data, selectedOption, searchText, columns]);

  const sortedData = useMemo(() => orderBy
    ? stableSort(filteredData, getComparator(order, orderBy))
    : filteredData, [orderBy, order, filteredData, stableSort, getComparator]);

  const paginatedData = useMemo(() => sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [sortedData, page, rowsPerPage]);

  const handleSelectionChange = useCallback((selectedOption: { title: string } | null, search: string) => {
    setSelectedOption(selectedOption);
    setSearchText(search);
  }, []);

  const handleCheckboxClick = useCallback((index: number) => {
    const currentIndex = selectedRows.indexOf(index);
    const newSelectedRows = [...selectedRows];

    if (currentIndex === -1) {
      newSelectedRows.push(index);
    } else {
      newSelectedRows.splice(currentIndex, 1);
    }

    setSelectedRows(newSelectedRows);
  }, [selectedRows]);

  const isSelected = useCallback((index: number) => selectedRows.indexOf(index) !== -1, [selectedRows]);

  const onDeleteClick = useCallback(() => {
    if (selectedRows.length === 1) {
      const selectedIndex = selectedRows[0];
      const selectedRow = paginatedData[selectedIndex];
      setSelectedRow(selectedRow);
      setDeleteDialogOpen(true);
    }
  }, [selectedRows, paginatedData]);

  const onDeleteConfirm = useCallback(() => {
    if (selectedRow) {
      const id = selectedRow[columns[0].id];
      onDelete(Number(id));
      setDeleteDialogOpen(false);
      setSelectedRows([]);
      setSelectedRow(null);
    }
  }, [selectedRow, onDelete, columns]);

  const handleEditClick = useCallback(() => {
    if (selectedRows.length === 1 && onEdit) {
      const selectedIndex = selectedRows[0];
      const selectedRow = paginatedData[selectedIndex];
      onEdit(selectedRow);
    }
  }, [selectedRows, onEdit, paginatedData]);

  return (
    <TableContainer component={Paper}>
      {showDropdown && (
        <Box style={{ paddingTop: '25px' }}>
          <CheckboxDropdown
            options={dropdownOptions}
            onSelectionChange={handleSelectionChange}
          />
        </Box>
      )}
      <Box className={classes.buttonContainer}>
        {onAdd && (
          <Button
            variant="contained"
            color="primary"
            onClick={onAdd}
            startIcon={<FontAwesomeIcon icon={faSquarePlus} />}
            style={{ marginRight: '10px' }}
          >
            Agregar
          </Button>
        )}
        <Button
          variant="contained"
          color="default"
          onClick={handleEditClick}
          disabled={selectedRows.length !== 1}
          startIcon={<FontAwesomeIcon icon={faEdit} />}
          style={{ marginRight: '10px' }}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onDeleteClick}
          disabled={selectedRows.length !== 1}
          startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
        >
          Eliminar
        </Button>
      </Box>
      <Table aria-label="generic table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"></TableCell>
            {columns.map((column) =>
              column.hiddenColumn ? null : (
                <TableCell key={column.id as string}>
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              )
            )}
            <TableCell>Ver más</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.tableBody}>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell padding="checkbox">
                  <IconButton onClick={() => handleCheckboxClick(rowIndex)}>
                    <FontAwesomeIcon
                      icon={isSelected(rowIndex) ? faSquareCheck : faSquare}
                    />
                  </IconButton>
                </TableCell>
                {columns.map((column) =>
                  column.hiddenColumn ? null : (
                    <TableCell key={column.id as string}>
                      {String(row[column.id])}
                    </TableCell>
                  )
                )}
                <TableCell>
                  <IconButton aria-label="Ver más" onClick={() => onView(row)}>
                    <FontAwesomeIcon icon={faSquarePlus} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 2} align="center">
                No hay resultados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar "{selectedRow ? selectedRow[nameColumnId] : ''}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            No
          </Button>
          <Button onClick={onDeleteConfirm} color="primary" autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default GenericTable;
export type { Column };
