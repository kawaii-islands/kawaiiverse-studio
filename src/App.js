import React, { Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header";
import { theme } from "./constants/theme";
import { StyledEngineProvider } from "@mui/material/styles";
import "antd/dist/antd.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider, useDispatch } from "react-redux";
import store from "src/lib/redux/store";
import { setKwtPrice } from "./lib/redux/slices/price";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "./components/common/LoadingPage";

const persistor = persistStore(store);

const Store = React.lazy(() => import("src/pages/Store"));
const CreateGame = React.lazy(() => import("src/pages/Profile/CreateGame/CreateGame"));
const Profile = React.lazy(() => import("src/pages/Profile"));
const ManageNft = React.lazy(() => import("src/pages/Profile/ManageNft"));
const StoreProfile = React.lazy(() => import("src/pages/Profile/StoreProfile"));
const NFTDetail = React.lazy(() => import("src/components/common/NFTDetail"));
const Test = React.lazy(() => import("src/pages/Test"));

const UpdatePrice = () => {
	const dispatch = useDispatch();
	const updatePrice = async () => {
		try {
			const [kwtData] = await Promise.all([
				axios.get("https://api.coingecko.com/api/v3/simple/price?ids=kawaii-islands&vs_currencies=usd"),
			]);
			dispatch(setKwtPrice(kwtData?.data["kawaii-islands"]?.usd));
		} catch (error) {}
	};

	useEffect(() => {
		updatePrice();
		const interval = setInterval(updatePrice, 1000 * 60);
		return clearInterval(interval);
	}, []);

	return null;
};

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ThemeProvider theme={theme}>
					<StyledEngineProvider injectFirst>
						<UpdatePrice />
						<Header />
						<div className="app-layout">
							<Suspense fallback={<LoadingPage />}>
								<Routes>
									<Route path="/" element={<Store />} />
									<Route path="/store" element={<Store />} />
									<Route path="profile" element={<CreateGame />} />
									<Route path="/test" element={<Test />} />
									<Route path="account" element={<Profile />}>
										<Route path="manage-nft/:address" element={<ManageNft />} />
										<Route path="store/:address" element={<StoreProfile />} />
									</Route>
									<Route path="view-nft/:address/:nftId" element={<NFTDetail />} />
									<Route path="view-nft/:address/:nftId/:index" element={<NFTDetail />} />
								</Routes>
							</Suspense>
						</div>
						<ToastContainer />
					</StyledEngineProvider>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	);
}
