import { SuppliesResponse } from '../interfaces/Supplies'

export const getSupplyUnit = (id: string, supplies: SuppliesResponse[]) => {
  const supply = supplies.find((item) => item._id === id)
  if (supply) {
    return supply.unit
  }
  return ''
}
