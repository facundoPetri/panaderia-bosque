// GenericTable.tsx
import React, { useState } from 'react';
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import CheckboxDropdown from './DDLCheckBox';

interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
}

interface GenericTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  onView: (row: T) => void;
  dropdownOptions: { title: string }[];
  showDropdown?: boolean; // Nueva propiedad opcional
}

const useStyles = makeStyles({
  tableBody: {
    backgroundColor: '#BEBEBE',
  },
});

const GenericTable = <T extends object>({ columns, data, onView, dropdownOptions, showDropdown = true }: GenericTableProps<T>) => { // Valor por defecto true
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [selectedOption, setSelectedOption] = useState<{ title: string } | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const stableSort = <T,>(array: T[], comparator: (a: T, b: T) => number) => {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = <Key extends keyof any>(
    order: 'asc' | 'desc',
    orderBy: Key
  ): ((a: { [key in Key]: any }, b: { [key in Key]: any }) => number) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const filteredData = data.filter((row) => {
    const matchesDropdown = !selectedOption || columns.some(col => col.label === selectedOption.title && String(row[col.id]).toLowerCase().includes(searchText.toLowerCase()));
    return matchesDropdown;
  });

  const sortedData = orderBy
    ? stableSort(filteredData, getComparator(order, orderBy))
    : filteredData;

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSelectionChange = (selectedOption: { title: string } | null, search: string) => {
    setSelectedOption(selectedOption);
    setSearchText(search);
  };

  return (
    <TableContainer component={Paper}>
      {showDropdown && ( // Mostrar u ocultar el Dropdown basado en la propiedad showDropdown
        <Box style={{ paddingTop: '25px' }}>
          <CheckboxDropdown
            options={dropdownOptions}
            onSelectionChange={handleSelectionChange}
          />
        </Box>
      )}
      <Table aria-label="generic table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
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
            ))}
            <TableCell>Ver más</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.tableBody}>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.id as string}>
                    {String(row[column.id])}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton aria-label="Ver más" onClick={() => onView(row)}>
                    <FontAwesomeIcon icon={faSquarePlus} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center">
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
    </TableContainer>
  );
};

export default GenericTable;
export type { Column };
