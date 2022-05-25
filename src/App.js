import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header";
import { theme } from "./constants/theme";
import { StyledEngineProvider } from "@mui/material/styles";
import "antd/dist/antd.css";

const Store = React.lazy(() => import("src/pages/Store"));
const CreateGame = React.lazy(() => import("src/pages/Profile/CreateGame/CreateGame"));
const Profile = React.lazy(() => import("src/pages/Profile/index"));
const ManageNft = React.lazy(() => import("src/pages/Profile/ManageNft"));
const StoreProfile = React.lazy(() => import("src/pages/Profile/StoreProfile"));
const NFTDetail = React.lazy(() => import("src/components/common/NFTDetail"));

// const UpdatePrice = () => {
// 	const dispatch = useDispatch();
// 	const updatePrice = async () => {
// 		try {
// 			const [kwtData] = await Promise.all([
// 				axios.get("https://api.coingecko.com/api/v3/simple/price?ids=kawaii-islands&vs_currencies=usd"),
// 			]);
// 			dispatch(setKwtPrice(kwtData?.data["kawaii-islands"]?.usd));
// 		} catch (error) {}
// 	};

// 	useEffect(() => {
// 		updatePrice();
// 		const interval = setInterval(updatePrice, 1000 * 60);
// 		return clearInterval(interval);
// 	}, []);

// 	return null;
// };

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<StyledEngineProvider injectFirst>
				<Header />
				<div className="app-layout">
					<Suspense fallback="loading">
						<Routes>
							{/*  /profile  */}
							<Route path="/" element={<Store />} />
							<Route path="/store" element={<Store />} />
							<Route path="profile" element={<CreateGame />} />
							<Route path="account" element={<Profile />}>
								<Route path="manage-nft/:address" element={<ManageNft />} />
								<Route path="store/:address" element={<StoreProfile />} />
							</Route>
							<Route path="view-nft/:address/:nftId" element={<NFTDetail /> } />
						</Routes>
					</Suspense>
				</div>
			</StyledEngineProvider>
		</ThemeProvider>
	);
}
