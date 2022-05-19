import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header";
import { theme } from "./constants/theme";
import { StyledEngineProvider } from "@mui/material/styles";

const Marketplace = React.lazy(() => import("src/pages/Marketplace"));
const CreateGame = React.lazy(() => import("src/pages/Profile/CreateGame/CreateGame"));

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<StyledEngineProvider injectFirst>
				<Header />
				<div className="app-layout">
					<Suspense fallback="loading">
						<Routes>
							{/*  /profile  */}
							<Route path="/" element={<Marketplace />} />
							<Route path="profile" element={<CreateGame />} />
						</Routes>
					</Suspense>
				</div>
			</StyledEngineProvider>
		</ThemeProvider>
	);
}
