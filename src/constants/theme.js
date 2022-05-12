import { createTheme } from "@mui/material";

const theme = createTheme({
	palette: {
		primary: { main: "#F25858" },
		secondary: { main: "#944850" },
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					height: 70,
					justifyContent: "center",
					alignItems: "center",
					padding: "0 50px",
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					height: 44,
					textTransform: "unset",
					fontFamily: "Play",
					fontSize: 16,
					fontWeight: 700,
				},
			},
		},
	},
});

export { theme };
