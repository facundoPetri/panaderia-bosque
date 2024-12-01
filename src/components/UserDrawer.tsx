import { useState } from 'react'
import {
  Box,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  fullname: {
    marginRight: '1rem',
    color: 'white',
    fontWeight: 'bold',
  },
  logout: {
    position: 'fixed',
    right: 0,
    marginRight: '1rem',
  },
}))

interface UserDrawerProps {
  handleLogout: () => void
}

const UserDrawer = ({ handleLogout }: UserDrawerProps) => {
  const classes = useStyles()
  const navigate = useNavigate()

  // Add state for menu anchor
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openUserDrawer, setOpenUserDrawer] = useState(false)
  const fullname = sessionStorage.getItem('fullname')
  const userType = sessionStorage.getItem('userType')

  // Handle menu open
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpenUserDrawer(true)
  }

  // Handle menu close
  const handleCloseUserMenu = () => {
    setAnchorEl(null)
    setOpenUserDrawer(false)
  }

  const handleNavigate = () => {
    navigate('/users')
    handleCloseUserMenu()
  }
  // In the render section, update the IconButton and add Menu
  return (
    <>
      <Tooltip title="Opciones de usuario">
        <Box className={classes.logout}>
          <span className={classes.fullname}>{fullname}</span>
          <IconButton
            color="inherit"
            onClick={handleOpenUserMenu}
            aria-controls="user-menu"
            aria-haspopup="true"
          >
            <FontAwesomeIcon icon={faUser} color="white" />
          </IconButton>
        </Box>
      </Tooltip>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={openUserDrawer}
        onClose={handleCloseUserMenu}
        keepMounted
        disableScrollLock={true} // Prevents scroll removal
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            marginTop: '30px',
          },
        }}
      >
        {userType === 'admin' && (
          <MenuItem onClick={handleNavigate}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: 8 }} />
            Administrar usuarios
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 8 }} />
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserDrawer
