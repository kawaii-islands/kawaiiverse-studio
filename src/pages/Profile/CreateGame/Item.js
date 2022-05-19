import cn from "classnames/bind";
import styles from "./CreateGame.module.scss";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logoKawaii from "src/assets/images/logo_kawaii.png";
import logoTrend from "src/assets/icons/trend1.png";
import logoLayers from "src/assets/icons/layers1.png";
import logoHome from "src/assets/icons/home.png";
// import { useHistory } from "react-router";
const cx = cn.bind(styles);

const Item = () => {
	// const history = useHistory();

	return (
		<Card className={cx("item-card", "card")}>
			<CardContent>
				<Typography className={cx("item-header")}>
					<img src={logoKawaii} alt="logo" className={cx("game-logo")} />
					{/* Kawaii Islands */}
					{/* {item.gameName}  */}
					abc
				</Typography>
				<Typography className={cx("item-paragraph")}>
					<img src={logoLayers} alt="logo" className={cx("game-mini")} />
					Items: <span className={cx("game-amount")}>100</span>
				</Typography>
				<Typography className={cx("item-paragraph")}>
					<img src={logoTrend} alt="logo" className={cx("game-mini")} />
					Total sale: <span className={cx("game-amount")}>1,000,000 KWT</span>
				</Typography>
				<Typography className={cx("item-paragraph")}>
					<img src={logoHome} alt="logo" className={cx("game-mini")} />
					Address:{" "}
					{/* <a href={`https://testnet.bscscan.com/address/${item.gameAddress}`} target="_blank">
						<span className={cx("game-amount")}>{shortenAddress(item.gameAddress)}</span>
					</a> */}
				</Typography>
			</CardContent>
			<CardActions className={cx("create-action")}>
				<Button
					size="small"
					className={cx("create-button")}
					// onClick={() => history.push(`profile/manage-nft/${item.gameAddress}`)}
				>
					Join now
				</Button>
			</CardActions>
		</Card>
	);
};
export default Item;
