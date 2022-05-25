import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { URL } from "src/constants/constant";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Tab from "src/components/Profile/Tab";
import { read } from "src/services/web3";
import { BSC_CHAIN_ID } from "src/constants/network";
import { FACTORY_ADDRESS } from "src/constants/address";
import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";

const cx = cn.bind(styles);

const Profile = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { account } = useWeb3React();
	const [loading, setLoading] = useState(true);
	const [isGameTab, setIsGameTab] = useState(false);
	const [openFilterModal, setOpenFilterModal] = useState(false);
	const [gameList, setGameList] = useState([]);
	const { address } = useParams();
	const [gameSelected, setGameSelected] = useState(address);
	const [gameInfo, setGameInfo] = useState({
		gameName: "",
		gameUrl: "",
	});
	const pathnames = pathname.split("/").filter(Boolean);

	useEffect(() => {
		setLoading(true);
		setLoading(false);
	}, []);

	useEffect(() => {
		logInfo();
	}, [account]);

	useEffect(() => {
		setGameSelected(address);
		getGameInfo();
	}, [address]);

	const getGameInfo = async () => {
		if (!address) return;

		try {
			let gameName = await read("name", BSC_CHAIN_ID, address, NFT1155_ABI, []);
			const res = await axios.get(`${URL}/v1/game/logo?contract=${address}`);
			let gameUrl = "";
			if (res.data.data[0]) {
				gameUrl = res.data.data[0].logoUrl;
			}
			setGameInfo({ gameName, gameUrl });
		} catch (error) {
			console.log(error);
		}
	};

	const logInfo = async () => {
		if (account) {
			setGameList([]);
			const list = [];
			try {
				const totalGame = await read("nftOfUserLength", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account]);
				for (let index = 0; index < totalGame; index++) {
					let gameAddress = await read("nftOfUser", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account, index]);
					let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
					list.push({ gameAddress, gameName });
				}
				setGameList(list);
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div className={cx("profile")}>
			<div className={cx("row")}>
				<div className={cx("left")}>
					<Tab gameInfo={gameInfo} />
				</div>

				<div className={cx("right")}>
					<div className={cx("breadcrumbs")}>
						{" "}
						<Breadcrumbs separator={<NavigateNextIcon />} aria-label="breadcrumb">
							{pathnames.map((name, index) => {
								if (index === 2) return;
								let routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
								if (index === 1) {
									routeTo = routeTo + `/${pathnames[2]}?view=true`;
								}

								return (
									<span
										key={name}
										onClick={() => {
											if (index < 2) navigate(routeTo);
										}}>
										{name.replace("-", " ")}
									</span>
								);
							})}
						</Breadcrumbs>
					</div>

					<div className={cx("content")}>
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
