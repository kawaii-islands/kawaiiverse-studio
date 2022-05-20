import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Typography } from "@mui/material";
import kwtLogo from "src/assets/icons/kwt.png";

const cx = cn.bind(styles);

export default function NFTCard({ nftInfo, hasPrice }) {
	return (
		<div className={cx("card")}>
			<Typography variant="body2" className={cx("id")}>
				{nftInfo?.tokenId}
			</Typography>
			<div className={cx("avatar")}>
				<img src={nftInfo?.imageUrl} />
				{hasPrice && (
					<Typography variant="body1" className={cx("balance")}>
						2
					</Typography>
				)}
			</div>
			<Typography variant="body1" className={cx("name")}>
				{nftInfo?.name}
			</Typography>
			{hasPrice && (
				<div className={cx("price")}>
					<img src={kwtLogo} />
					<Typography className={cx("amount")}>1,573.231</Typography>
					<Typography className={cx("usd")}>$240</Typography>
				</div>
			)}
		</div>
	);
}
