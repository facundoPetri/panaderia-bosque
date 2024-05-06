import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Recetas from './Recetas';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/recetas",
    element: <Recetas title="Recetas" />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);
