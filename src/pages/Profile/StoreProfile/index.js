import React, { useState, useEffect } from "react";
import cn from "classnames/bind";
import styles from "./index.module.scss";

const cx = cn.bind(styles);
const StoreProfile = ({ gameSelected }) => {
	const [isSellNFT, setIsSellNFT] = useState(false);

	return (
		<div className={cx("profile")}>
			<div className={cx("right")}>
				<div className={cx("content")}>Store</div>
			</div>
		</div>
	);
};

export default StoreProfile;
