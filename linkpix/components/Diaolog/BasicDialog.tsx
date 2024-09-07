import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import React, { useCallback } from "react";

interface BasicDialogProps extends DialogProps {
  closeDialog: () => void;
  onConfirm: () => void;
}

const BasicDialog = (props: BasicDialogProps) => {
  const { title, content, closeDialog, onConfirm, ...dialogProps } = props;

  const handleConfirm = useCallback(() => {
    onConfirm();
    closeDialog();
  }, [closeDialog, onConfirm]);

  return (
    <Dialog {...dialogProps} disableRestoreFocus>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          variant="outlined"
          color="error"
          startIcon={<CancelOutlined />}
        >
          {"Cancel"}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          startIcon={<CheckCircleOutline />}
          autoFocus
        >
          {"Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BasicDialog;
