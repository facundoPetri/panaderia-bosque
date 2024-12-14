import { Box, Input, MenuItem, Select, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { OrderStateFilter } from '../interfaces/Orders'
import { MaintenanceFilter } from '../interfaces/Machines'

const useStyles = makeStyles({
  headerWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
    width: '500px',
  },
  lastSupply: {
    width: '700px',
    fontWeight: 500,
    fontSize: '1rem',
  },
})

interface FilterOption<T> {
  value: T
  label: string
}

interface FilterSelectProps<T extends string | number> {
  value: T
  onChange: (value: T) => void
  options: FilterOption<T>[]
  title?: string
  className?: string
}

export const daysOptions: FilterOption<number>[] = [
  { value: 7, label: '7 días' },
  { value: 15, label: '15 días' },
  { value: 30, label: '30 días' },
]

export const orderStateOptions: FilterOption<OrderStateFilter>[] = [
  { value: OrderStateFilter.ALL, label: 'Todos' },
  { value: OrderStateFilter.CREATED, label: 'Creado' },
  { value: OrderStateFilter.PENDING, label: 'Pendiente' },
  { value: OrderStateFilter.COMPLETED, label: 'Completado' },
  { value: OrderStateFilter.CANCELLED, label: 'Cancelado' },
]

export const maintainanceNeededOptions: FilterOption<MaintenanceFilter>[] = [
  { value: MaintenanceFilter.ALL, label: 'Todos' },
  { value: MaintenanceFilter.YES, label: 'Si' },
  { value: MaintenanceFilter.NO, label: 'No' },
]

export function FilterSelect<T extends string | number>({
  value,
  onChange,
  options,
  title = 'Seleccionar',
  className,
}: Readonly<FilterSelectProps<T>>) {
  const classes = useStyles()

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange(event.target.value as T)
  }

  return (
    <Box className={`${classes.headerWrapper} ${className}`}>
      <Typography className={classes.lastSupply}>{title}</Typography>
      <Select
        fullWidth
        labelId="selector"
        value={value}
        onChange={handleChange}
        input={<Input />}
      >
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}
