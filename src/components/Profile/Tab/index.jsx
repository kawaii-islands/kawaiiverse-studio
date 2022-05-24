import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import styles from "./index.module.scss";
import logoKawaii from "src/assets/images/logo_kawaii.png";
import { useNavigate, useParams, useLocation } from "react-router";
import manageNftIcon from "src/assets/icons/manage-nft-icon.svg";
import storeIcon from "src/assets/icons/store-icon.svg";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { toast } from "react-toastify";

const cx = cn.bind(styles);

const tab = [
	{
		key: 1,
		path: "manage-nft",
		name: "Manage NFT",
		icon: manageNftIcon,
	},
	{
		key: 2,
		path: "store",
		name: "Store",
		icon: storeIcon,
	},
];

const Tab = ({  gameInfo }) => {
	const navigate = useNavigate();
	const location = useLocation();
	let { address } = useParams();

	return (
		<>
			<div className={cx("filter")}>
				<div className={cx("game-info")}>
					<div className={cx("image-box")}>
						<img src={gameInfo?.gameUrl} alt="game" className={cx("game-image")} />
					</div>

					<div className={cx("game-name")}>
						<div>{gameInfo?.gameName}</div>
						<div style={{ fontSize: "12px", fontWeight: "400" }}>
							{address.slice(0, 6) + "..." + address.slice(-6)} &nbsp;{" "}
							<ContentCopyRoundedIcon
								className={cx("icon-copy")}
								onClick={() => {
									navigator.clipboard.writeText(address);
									toast.success("Copied!");
								}}
							/>
						</div>
					</div>
				</div>

				<div className={cx("menu")}>
					{tab.map((tab, id) => (
						<div
							className={cx("menu-item", location.pathname.toLowerCase().includes(tab.path) && "active")}
							key={id}
							onClick={() => {
								navigate(`/account/${tab.path}/${address}`);
							}}>
							<div className={cx("menu-title")}>
								<img src={tab.icon} alt="icon-title" />
								<span>{tab.name}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Tab;
