import React from 'react'
import { downloadPdf } from '../utils/utils'
import { Button, makeStyles } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles(() => ({
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const DownloadPdfButton = ({ url }: { url: string }) => {
  const classes = useStyles()

  return (
    <div className={classes.btnContainer}>
      <Button onClick={() => downloadPdf(url)}>
        <FontAwesomeIcon icon={faFilePdf} size="2x" />
      </Button>
    </div>
  )
}

export default DownloadPdfButton
