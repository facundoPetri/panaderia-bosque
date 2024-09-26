import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faHouse,
  faUser,
  faList,
  faBuilding,
  faBlender,
  faEgg,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons'

import logo from '../assets/logo.png'
import { useAuth } from '../stores/AuthContext'

const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  logo: {
    width: '4rem',
    height: '4rem',
    cursor: 'pointer',
    position: 'fixed',
    left: '49%',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}))
interface LinkItem {
  name: string
  path: string
  icon?: any
}
const SidebarAndTopbar = () => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false)
  const [expandedMenuItem, setExpandedMenuItem] = useState('')
  const { logout } = useAuth()

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }
  const routes: LinkItem[] = [
    { name: 'Inicio', path: '/', icon: <FontAwesomeIcon icon={faHouse} /> },
    {
      name: 'Insumos',
      path: '/supplies',
      icon: <FontAwesomeIcon icon={faEgg} />,
    },
    {
      name: 'Usuarios',
      path: '/users',
      icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
      name: 'Recetas',
      path: '/recipes',
      icon: <FontAwesomeIcon icon={faList} />,
    },
    {
      name: 'Proveedores',
      path: '/providers',
      icon: <FontAwesomeIcon icon={faBuilding} />,
    },
    {
      name: 'Maquinarias',
      path: '/machinery',
      icon: <FontAwesomeIcon icon={faBlender} />,
    },
  ]
  const hideExpand = ['Inicio']
  const navigate = useNavigate()
  const handleExpanded = (name: string) => {
    setExpandedMenuItem((prev) => (prev === name ? '' : name))
  }
  const insumosRoutes: LinkItem[] = [
    { name: 'Consulta de insumos', path: '/supplies' },
    {
      name: 'Insumos con vencimiento próx.',
      path: '/supplies/expiring',
    },
    { name: 'Insumos con bajo stock', path: '/supplies/lowStock' },
    { name: 'Registro de uso de insumos', path: '/supplies/usageLog' },
    { name: 'Desperdicio de inventario', path: '/supplies/inventoryWaste' },
    {
      name: 'Eficiencia de producción',
      path: '/supplies/productionEfficiency',
    },
    {
      name: 'Lotes de insumos',
      path: '/supplies/batches',
    },
  ]
  const usuariosRoutes: LinkItem[] = [
    { name: 'Consulta de usuarios', path: '/users' },
  ]
  const recetasRoutes: LinkItem[] = [
    { name: 'Consulta de recetas', path: '/recipes' },
  ]
  const proveedoresRoutes: LinkItem[] = [
    { name: 'Listado de proveedores', path: '/providers' },
    {
      name: 'Pedidos a proveedores',
      path: '/providers/orders',
    },
    {
      name: 'Consulta de calidad y puntualidad de materia prima',
      path: '/providers/qualityAndPunctuality',
    },
  ]
  const maquinariasRoutes: LinkItem[] = [
    { name: 'Consulta de maquinarias', path: '/machinery' },
    {
      name: 'Gestión y mantenimiento de maquinarias',
      path: '/machinery/maintenance',
    },
  ]
  const getSubmenuItems = (name: string) => {
    switch (name) {
      case 'Insumos':
        return insumosRoutes
      case 'Usuarios':
        return usuariosRoutes
      case 'Recetas':
        return recetasRoutes
      case 'Proveedores':
        return proveedoresRoutes
      default:
        return maquinariasRoutes
    }
  }
  const handleNavigatePath = (path: string) => {
    navigate(path)
    handleDrawerClose()
  }
  const handleLogout = () => {
    setOpenLogoutDialog(true)
  }
  const handleCloseDialog = () => {
    setOpenLogoutDialog(false)
  }
  const handleConfirmLogout = () => {
    handleCloseDialog()
    logout()
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Dialog open={openLogoutDialog} onClose={handleCloseDialog}>
        <DialogTitle id="form-dialog-title">Cerrar Sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás seguro/a de cerrar sesión ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmLogout}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.topbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <FontAwesomeIcon icon={faBars} color="white" />
          </IconButton>
          <img
            onClick={() => handleNavigatePath('/')}
            src={logo}
            alt="Logo Panaderia Bosque"
            className={classes.logo}
          />
          <IconButton
            color="inherit"
            onClick={() => handleLogout()}
            edge="start"
          >
            <FontAwesomeIcon icon={faPowerOff} color="white" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <FontAwesomeIcon icon={faChevronLeft} />
            ) : (
              <FontAwesomeIcon icon={faChevronRight} />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {routes.map((item: LinkItem, index) => (
            <Box key={item.name}>
              <ListItem
                button
                onClick={() =>
                  index === 0
                    ? handleNavigatePath(item.path)
                    : !hideExpand.includes(item.name) &&
                      handleExpanded(item.name)
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
                {hideExpand.includes(
                  item.name
                ) ? undefined : expandedMenuItem === item.name ? (
                  <FontAwesomeIcon icon={faChevronUp} />
                ) : (
                  <FontAwesomeIcon icon={faChevronDown} />
                )}
              </ListItem>
              <Collapse
                in={item.name === expandedMenuItem}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {getSubmenuItems(expandedMenuItem).map((item) => (
                    <ListItem
                      button
                      className={classes.nested}
                      key={item.name}
                      onClick={() => handleNavigatePath(item.path)}
                    >
                      {item.icon ? (
                        <ListItemIcon>{item.icon}</ListItemIcon>
                      ) : undefined}
                      <ListItemText primary={item.name} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
        <Divider />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      ></main>
    </div>
  )
}

export default SidebarAndTopbar
