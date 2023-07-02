import { CssBaseline } from "@mui/material";
import { grey } from "@mui/material/colors";
import darkScrollbar from "@mui/material/darkScrollbar";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import { useSelector } from "react-redux";

/**
 * @description This file contains a theme provider that works with Material UI
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */

const PRIMARY = {
  main: "#3379c6",
  light: "#284eb2",
  lighter: "#3379c6",
  morelighter: "#5893d4",
  mostlighter: "#81adde",
  white: "#ffffff",
};

const SECONDARY = {
  lighter: "#D6E4FF",
  light: "#1DA1F2",
  main: "#1DA1F2",
  dark: "#424242",
  darker: "#091A7A",
  contrastText: "#FFF",
};

const TERTIARY = {
  light: { main: "#000000" },
  dark: { main: "#FFFFFF" },
};

const TEXT = {
  light: "#333333",
  dark: "#FFFFFF",
  disabled: "#BDBDBD",
};

const ERROR = {
  main: "#F44336",
  light: "#FF5722",
  dark: "#C62820",
};

const WARNING = {
  main: "#FFAB91",
  light: "#FFECB3",
  dark: "#D18B47",
};

const SUCCESS = {
  lighter: "#E9FCD4",
  light: "#AAF27F",
  main: "#54D62C",
  dark: "#229A16",
  darker: "#08660D",
  contrastText: "#FFF",
};

const CANVASCOLOR = {
  light: "#FFFFFF",
  dark: "#000000",
};

const BACKGROUND = {
  paper: { light: "#FFFFFF", dark: "#000000" },
};

const TYPOGRAPHY = {
  fontFamily: '"Be Vietnam Pro", sans-serif',
  fontSize: 12,
};

function ThemeProvider({ children }) {
  let { theme: modeState } = useSelector(state => state.theme);
  const modeStorage = window.localStorage.getItem("theme");
  if (modeStorage && modeState !== modeStorage) {
    modeState = modeStorage;
  }

  const themeOptions = {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            ...darkScrollbar(
              modeState === "light"
                ? {
                    track: grey[200],
                    thumb: grey[400],
                    active: grey[400],
                  }
                : undefined
            ),
            //scrollbarWidth for Firefox
            scrollbarWidth: "thin",
          },
        },
      },
    },
    palette: {
      mode: modeState,
      primary: PRIMARY,
      secondary: SECONDARY,
      tertiary: TERTIARY,
      error: ERROR,
      warning: WARNING,
      success: SUCCESS,
      text: TEXT,
      background: BACKGROUND,
      canvasColor: CANVASCOLOR,
    },
    typography: TYPOGRAPHY,
    shape: { borderRadius: 8 },
  };

  const theme = createTheme(themeOptions);

  return (
    <>
      <MUIThemeProvider theme={theme}>
        <CssBaseline>{children}</CssBaseline>
      </MUIThemeProvider>
    </>
  );
}

export default ThemeProvider;
