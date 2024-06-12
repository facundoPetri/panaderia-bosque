import { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import UserIcon from '@material-ui/icons/People'
import LibraryBooks from '@material-ui/icons/LibraryBooks'
import Apple from '@material-ui/icons/Apple'
import Home from '@material-ui/icons/Home'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { useNavigate } from 'react-router-dom'
import { Box, Collapse } from '@material-ui/core'
import { Business } from '@material-ui/icons'
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
}))
interface LinkItem {
  name: string
  path: string
  icon?: any
}
const Sidebar = () => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [expandedMenuItem, setExpandedMenuItem] = useState('')

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }
  const routes: LinkItem[] = [
    { name: 'Inicio', path: '/', icon: <Home /> },
    { name: 'Insumos', path: '/insumos', icon: <Apple /> },
    { name: 'Usuarios', path: '/usuarios', icon: <UserIcon /> },
    { name: 'Recetas', path: '/recetas', icon: <LibraryBooks /> },
    { name: 'Proveedores', path: '/proveedores', icon: <Business /> },
    { name: 'Maquinarias', path: '/maquinarias', icon: <LibraryBooks /> },
  ]
  const hideExpand = ['Inicio']
  const navigate = useNavigate()
  const handleOpenView = (path: string = '/') => navigate(path)
  const handleExpanded = (name: string) => {
    setExpandedMenuItem((prev) => (prev === name ? '' : name))
  }
  const insumosRoutes: LinkItem[] = [
    { name: 'Consulta de insumos', path: '/insumos' },
    {
      name: 'Insumos con vencimiento próx.',
      path: '/insumos',
    },
    { name: 'Insumos con bajo stock', path: '/insumos' },
  ]
  const getSubmenuItems = (name: string) => {
    switch (name) {
      case 'Insumos':
        return insumosRoutes

      default:
        return insumosRoutes
    }
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Panaderia Bosque
          </Typography>
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
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {routes.map((item: LinkItem) => (
            <Box key={item.name}>
              <ListItem button onClick={() => handleExpanded(item.name)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
                {hideExpand.includes(
                  item.name
                ) ? undefined : expandedMenuItem === item.name ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItem>
              <Collapse
                in={item.name === expandedMenuItem}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {getSubmenuItems(expandedMenuItem).map((item) => (
                    <ListItem button className={classes.nested} key={item.name}>
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

export default Sidebar
