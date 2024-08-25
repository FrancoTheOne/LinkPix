"use client";

/**
 * Theme structure
 * https://mui.com/material-ui/customization/default-theme/
 */

import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { blueGrey, indigo } from "@mui/material/colors";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: blueGrey[300],
      main: blueGrey[500],
      dark: blueGrey[700],
    },
    secondary: {
      main: indigo[500],
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
