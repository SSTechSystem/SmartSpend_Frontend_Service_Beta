import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#000000",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#cbd5e1",
    },
    secondary: {
      main: "#cbd5e1",
    },
  },
});

export { lightTheme, darkTheme };
