import { useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useState } from "react";

const useDialog = () => {
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: "Confirmation",
    content: "Are you sure?",
    onConfirm: () => {},
  });

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  return {
    dialogData: {
      open,
      title: dialogData.title,
      content: dialogData.content,
      onConfirm: dialogData.onConfirm,
      closeDialog,
    },
    openDialog,
    setDialogData,
  };
};

export default useDialog;
