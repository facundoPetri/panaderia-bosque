import { Route, Routes } from 'react-router-dom'

import { CssBaseline, makeStyles } from '@material-ui/core'

import Sidebar from '../components/Sidebar'
import Home from '../pages/Home'
import { 
  Recipes, 
  Supplies, 
  ExpiringSupply, 
  SuppliesWithLowStock, 
  ProductionEfficiencies, 
  MachinesMaintenance, 
  Users, 
  Providers, 
  QualityAndPunctualityReport, 
  OrdersProviders, 
  WasteReports, 
  StocksUsage 
} from '../pages/index'

const useStyles = makeStyles({
  wrapper: {
    marginTop: '2rem',
  },
})

const AppPage = () => {
  const classes = useStyles()
  return (
    <div>
      <CssBaseline />
      <Sidebar />
      <div className={classes.wrapper}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/supplies" element={<Supplies />} />
          <Route path="/supplies/expiring" element={<ExpiringSupply />} />
          <Route path="/supplies/lowStock" element={<SuppliesWithLowStock />} />
          <Route path="/supplies/usageLog" element={<StocksUsage />} />
          <Route path="/supplies/inventoryWaste" element={<WasteReports />} />
          <Route path="/supplies/productionEfficiency" element={<ProductionEfficiencies />} />
          <Route path="/users" element={<Users />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/providers/orders" element={<OrdersProviders />} />
          <Route path="/providers/qualityAndPunctuality" element={<QualityAndPunctualityReport />} />
          <Route path="/machinery" element={<MachinesMaintenance />} />
        </Routes>
      </div>
    </div>
  )
}

export default AppPage
