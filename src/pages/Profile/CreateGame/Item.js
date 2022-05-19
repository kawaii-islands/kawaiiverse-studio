import cn from "classnames/bind";
import styles from "./CreateGame.module.scss";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logoKawaii from "src/assets/images/logo_kawaii.png";
import logoTrend from "src/assets/icons/trend1.png";
import logoLayers from "src/assets/icons/layers1.png";
import logoHome from "src/assets/icons/home.png";
import logoEdit from "src/assets/icons/edit1.png";
const cx = cn.bind(styles);

const Item = ({ item }) => {
	return (
		<Card className={cx("item-card", "card")}>
			<CardContent>
				<div className={cx("item-header")}>
					<img src={item.gameUrl != "" ? item.gameUrl : logoKawaii} alt="logo" className={cx("game-logo")} />
					{item.gameName}
					<img src={logoEdit} alt="logo" className={cx("game-mini")} />
				</div>
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
					Address: <span className={cx("game-amount")}>0xabc...cba</span>
				</Typography>
			</CardContent>
			<CardActions className={cx("create-action")}>
				<Button size="small" className={cx("create-button")}>
					Join now
				</Button>
			</CardActions>
		</Card>
	);
};
export default Item;
