import {createMuiTheme} from "@material-ui/core/styles";

const theme = createMuiTheme({
    palette:{
        primary:{
            light: "#80d6ff",
            main: "#42a5f5",
            dark: "#42a5f5"
        },
        secondary: {
            main: "#ffb74d"
        }
    },
    typography: {
        button:{
            fontSize: "14px",
            lineHeight: "1."
        }
    }
});

export default theme;