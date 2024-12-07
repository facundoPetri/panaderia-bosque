import { ReactNode, FC } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
const useStyles = makeStyles((theme) => {
  return {
    dialogContent: {
        height:'300px',
        width:'400px'
    },
  }
})
interface GenericDialogProps {
  open: boolean
  handleClose: () => void
  title: string
  content: ReactNode
  primaryButtonTitle: string
  secondaryButtonTitle: string
  primaryButtonAction: () => void
  secondaryButtonAction: () => void
}
const GenericDialog: FC<GenericDialogProps> = ({
  open,
  handleClose,
  title,
  content,
  primaryButtonAction,
  primaryButtonTitle,
  secondaryButtonAction,
  secondaryButtonTitle,
}) => {
  const classes = useStyles()
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent className={classes.dialogContent}>{content}</DialogContent>
      <DialogActions>
        <Button onClick={() => secondaryButtonAction()} color="secondary">
          {secondaryButtonTitle}
        </Button>
        <Button
          onClick={() => primaryButtonAction()}
          color="primary"
          variant="contained"
        >
          {primaryButtonTitle}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GenericDialog
