import React from 'react'
import { downloadPdf } from '../utils/utils'
import { Button } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'

const DownloadPdfButton = ({ url }: { url: string }) => {
  return (
    <Button
      onClick={() => downloadPdf(url)}
    >
      <FontAwesomeIcon icon={faFilePdf} size="2x" />
    </Button>
  )
}

export default DownloadPdfButton
