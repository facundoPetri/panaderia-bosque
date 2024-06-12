import { Route, Routes as RoutesDom } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import AppPage from "./AppPage";

const Routes = () => {
  return (
    <RoutesDom>
      <Route path="/auth/" element={<LoginPage />} />
      <Route path="/*" element={<PrivateRoute component={AppPage} />} />
    </RoutesDom>
  );
};

export default Routes;
