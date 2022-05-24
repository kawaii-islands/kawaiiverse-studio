import React, { useState, useEffect } from "react";
import cn from "classnames/bind";
import styles from "./index.module.scss";
import ViewNFT from "./ViewNFT";
import SellNFT from "./SellNFT";
import { useParams } from "react-router-dom";

const cx = cn.bind(styles);
const StoreProfile = () => {
	const [isSellNFT, setIsSellNFT] = useState(false);
	const urlParams = new URLSearchParams(window.location.search);
	const params = useParams();

	useEffect(() => {
		if (urlParams.get("view") === "true") {
			setIsSellNFT(false);
		}

		if (urlParams.get("view") === "false") {
			setIsSellNFT(true);
		}
	}, [urlParams]);

	return (
		<div className={cx("profile")}>
			<div className={cx("right")}>
				<div className={cx("content")}>
					{isSellNFT ? (
						<SellNFT gameSelected={params.address} setIsSellNFT={setIsSellNFT} isSellNFT={isSellNFT} />
					) : (
						<ViewNFT gameSelected={params.address} setIsSellNFT={setIsSellNFT} isSellNFT={isSellNFT} />
					)}
				</div>
			</div>
		</div>
	);
};

export default StoreProfile;
