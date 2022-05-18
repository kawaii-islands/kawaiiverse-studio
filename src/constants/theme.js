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
					fontSize: 16,
					fontWeight: 700,
				},
			},
		},
		MuiTypography: {
			styleOverrides: {
				root: { color: "#833f1d", fontFamily: "Play" },
				h6: {
					fontSize: "20px",
					fontWeight: 700,
				},
				h5: {
					fontSize: "24px",
					fontWeight: 700,
				},
				body1: {
					fontSize: "16px",
				},
				body2: {
					fontSize: "14px",
				},
			},
		},
	},
});

export { theme };
