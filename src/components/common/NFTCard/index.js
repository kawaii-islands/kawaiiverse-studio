import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Typography } from "@mui/material";
import kwtLogo from "src/assets/icons/kwt.png";

const cx = cn.bind(styles);

export default function NFTCard() {
	return (
		<div className={cx("card")}>
			<Typography variant="body2" className={cx("id")}>
				#123456
			</Typography>
			<div className={cx("avatar")}>
				<img src="https://images.kawaii.global/kawaii-marketplace-image/items/10506008.png" />
				<Typography variant="body1" className={cx("balance")}>
					2
				</Typography>
			</div>
			<Typography variant="body1" className={cx("name")}>
				Alluring Mirror Split
			</Typography>
			<div className={cx("price")}>
				<img src={kwtLogo} />
				<Typography className={cx("amount")}>1,573.231</Typography>
				<Typography className={cx("usd")}>$240</Typography>
			</div>
		</div>
	);
}
