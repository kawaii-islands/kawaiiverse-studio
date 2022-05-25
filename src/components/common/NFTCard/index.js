import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Typography } from "@mui/material";
import kwtLogo from "src/assets/icons/kwt.png";
import { BSC_rpcUrls } from "src/constants/blockchain";
import Web3 from "web3";
import { useSelector } from "react-redux";
import formatNumber from "src/utils/formatNumber";

const web3 = new Web3(BSC_rpcUrls);
const cx = cn.bind(styles);

export default function NFTCard({ nftInfo, hasPrice }) {
	const { kwtPrice } = useSelector(state => state?.price);
	console.log("kwtPrice :>> ", kwtPrice);

	return (
		<div className={cx("card")}>
			<Typography variant="body2" className={cx("id")}>
				{nftInfo?.tokenId}
			</Typography>
			<div className={cx("avatar")}>
				<img src={nftInfo?.imageUrl} />
				{hasPrice && (
					<Typography variant="body1" className={cx("balance")}>
						{nftInfo?.amount - nftInfo?.alreadySale}
					</Typography>
				)}
			</div>
			<Typography variant="body1" className={cx("name")}>
				{nftInfo?.name}
			</Typography>
			{hasPrice && (
				<div className={cx("price")}>
					<img src={kwtLogo} />
					<Typography className={cx("amount")}>
						{nftInfo?.price ? Number(web3.utils.fromWei(nftInfo?.price.toString())) : 0}
					</Typography>
					<Typography className={cx("usd")}>
						${nftInfo?.price && formatNumber(Number(web3.utils.fromWei(nftInfo?.price.toString())) * kwtPrice)}
					</Typography>
				</div>
			)}
		</div>
	);
}
