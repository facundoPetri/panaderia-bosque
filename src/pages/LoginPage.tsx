import { useState } from 'react'

import { Box, Button, CircularProgress, TextField, makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import logo from '../assets/logo.png'
import { request } from '../common/request'
import { AutenticationResponse } from '../interfaces/Autentication'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/AuthContext'

const useStyles = makeStyles((theme) => ({
  logo: {
    width: '4rem',
    height: '4rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  inputsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  root: {
    width: '100%',
    height: 'calc(100vh - 1rem)',
    padding: '0rem',
    position: 'relative',
  },
  eyeIcon: {
    cursor: 'pointer',
  },
}))
const LoginPage = () => {
  const classes = useStyles()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      setLoading(true)
      const res = await request<AutenticationResponse>({
        path: '/auth/login',
        data: { email: username, password },
        method: 'POST',
      })
      if (res) {
        login({
          access_token: res.access_token,
          fullname: res.fullname,
          type: res.type,
        })
        setError(false)
        navigate('/')
      }
    } catch (e) {
      if (isAxiosError(e)) {
        setErrorMessage(e.response?.data?.message)
      }
    }finally{
    }
  }
  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={() => handleLogin()}>
        <img src={logo} alt="Logo Panaderia Bosque" className={classes.logo} />
        <Box className={classes.inputsWrapper}>
          <TextField
            id="outlined-basic"
            label="Usuario"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Contraseña"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <FontAwesomeIcon
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={classes.eyeIcon}
                  icon={showPassword ? faEyeSlash : faEye}
                />
              ),
            }}
          />
          <Button
            disabled={password.length === 0 || username.length === 0 || loading}
            variant="contained"
            color="primary"
            onClick={() => handleLogin()}
            endIcon={loading ? <CircularProgress size={20} color='primary' /> : undefined}
          >
            Iniciar sesión
          </Button>
          {error && errorMessage.length > 0 && (
            <Alert severity="error">{errorMessage}</Alert>
          )}
        </Box>
      </form>
    </div>
  )
}

export default LoginPage
