import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Option {
  title: string;
  hiddenFilter?: boolean;
}

interface CheckboxDropdownProps {
  options: Option[];
  onSelectionChange: (selectedOption: Option | null, searchText: string) => void;
}

const icon = <FontAwesomeIcon icon={faSquare} />;
const checkedIcon = <FontAwesomeIcon icon={faSquareCheck} />;

const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({ options, onSelectionChange }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleOptionChange = (event: React.ChangeEvent<{}>, value: Option | null) => {
    const option = options.find(opt => opt.title === value?.title);
    if (option?.hiddenFilter) {
      setSearchText(''); // Limpiar el texto de búsqueda si se selecciona una opción con hiddenFilter
    }
    setSelectedOption(value);
    onSelectionChange(value, option?.hiddenFilter ? '' : searchText);
  };

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setSearchText(text);
    onSelectionChange(selectedOption, text);
  };

  const getPlaceholderText = () => {
    if (!selectedOption) {
      return 'Buscar aquí...';
    }
    return selectedOption.title;
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={2} style={{ paddingLeft: 10 }}>
          <h3>Filtrar por:</h3>
          <Autocomplete
            id="checkbox-dropdown"
            options={options}
            getOptionLabel={(option) => option.title}
            onChange={handleOptionChange}
            renderOption={(option, { selected }) => (
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <span>{option.title}</span>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginLeft: 10 }}
                  checked={selectedOption?.title === option.title}
                />
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar opción"
                variant="outlined"
              />
            )}
          />
        </Grid>
        {selectedOption && !selectedOption.hiddenFilter && (
          <Grid item xs={2} style={{ paddingRight: 10 }}>
            <TextField
              label="Buscar"
              placeholder={getPlaceholderText()}
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchText}
              onChange={handleSearchTextChange}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default CheckboxDropdown;
