import ScrollToTop from "./base-components/ScrollToTop";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "./utils/materialTheme";
import { useAppSelector } from "./stores/hooks";
import { selectDarkMode } from "./stores/darkModeSlice";

const App = () => {
  const darkMode = useAppSelector(selectDarkMode);

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename="/smart-spend/admin/">
        <Router />
        <ScrollToTop />
      </BrowserRouter>
    </ThemeProvider>
  );
};

// Store the root in a module-level variable
let root = (window as any).__root;

if (!root) {
  const container = document.getElementById("root") as HTMLElement;
  root = ReactDOM.createRoot(container);
  (window as any).__root = root; // Store the root globally to reuse it
}

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
