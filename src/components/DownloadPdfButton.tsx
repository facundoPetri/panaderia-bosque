import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { downloadPdf } from '../utils/utils'
import { Button, Tooltip, makeStyles } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles(() => ({
  btnContainer: {
    margin: '1rem .5rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

const DownloadPdfButton = ({ url }: { url: string }) => {
  const classes = useStyles()
  const [isDisable, setIsDisable] = useState(false)

  const downloadPdfToast = async (url: string) => {
    setIsDisable(true)
    await toast.promise(downloadPdf(url), {
      pending: 'Descargando PDF...',
      success: 'PDF descargado',
      error: 'Error al descargar PDF',
    })
    setIsDisable(false)
  }

  return (
    <div className={classes.btnContainer}>
      <Tooltip title="Descargar consulta en PDF">
        <Button disabled={isDisable} onClick={() => downloadPdfToast(url)}>
          <FontAwesomeIcon icon={faFilePdf} size="2x" />
        </Button>
      </Tooltip>
    </div>
  )
}

export default DownloadPdfButton
