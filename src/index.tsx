import React from 'react';
import { render } from 'react-dom';
import Main from './Main';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'; // Librería de manejo de fechas

const root = document.getElementById('root');

render(
  <React.StrictMode>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Main />
    </MuiPickersUtilsProvider>
  </React.StrictMode>,
  root
);
