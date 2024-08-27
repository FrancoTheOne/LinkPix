import React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Link href={"/"}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LinkPix
          </Typography>
        </Link>
        <Button href={"/temp"}>Temp</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
