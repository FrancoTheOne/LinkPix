import React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LinkPix
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
