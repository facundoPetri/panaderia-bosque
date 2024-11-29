import { Box, Input, MenuItem, Select, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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

interface FilterDaysSelectProps {
  value: number
  onChange: (value: number) => void
  title?: string
  className?: string
}

const filterDaysOptions = [
  { days: 7, label: '7 días' },
  { days: 15, label: '15 días' },
  { days: 30, label: '30 días' },
]

export const FilterDaysSelect = ({
  value,
  onChange,
  title = 'Ultimos insumos usados',
  className,
}: FilterDaysSelectProps) => {
  const classes = useStyles()

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange(Number(event.target.value))
  }

  return (
    <Box className={`${classes.headerWrapper} ${className}`}>
      <Typography className={classes.lastSupply}>{title}</Typography>
      <Select
        fullWidth
        labelId="daysSelector"
        value={value}
        onChange={handleChange}
        input={<Input />}
      >
        {filterDaysOptions.map((filter) => (
          <MenuItem key={filter.days} value={filter.days}>
            {filter.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}
