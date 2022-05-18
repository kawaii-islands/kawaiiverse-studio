import GameAvatar from "src/assets/images/game.png";
import cn from "classnames/bind";
import styles from "./Game.module.scss";
import { Typography, Checkbox } from "@mui/material";

const cx = cn.bind(styles);

export default function Game({ active }) {
	return (
		<>
			<div className={cx("game")}>
				<img src={GameAvatar} className={cx("avatar", "active")} />
				<Typography variant="body1" className={cx("name", "active")}>
					Kawaii Islands
				</Typography>
			</div>
			<div className={cx("attribute")}>
				<Checkbox className={cx("checkbox")} />
				<img
					src="https://images.kawaii.global/kawaii-marketplace-image/category/Icon_Field.png"
					className={cx("image")}
				/>
				<Typography variant="body2" className={cx("label", "active")}>
					Fields
				</Typography>
			</div>
			<div className={cx("attribute")}>
				<Checkbox className={cx("checkbox")} />
				<img
					src="https://images.kawaii.global/kawaii-marketplace-image/category/Icon_Field.png"
					className={cx("image")}
				/>
				<Typography variant="body2" className={cx("label")}>
					Fields
				</Typography>
			</div>
		</>
	);
}
