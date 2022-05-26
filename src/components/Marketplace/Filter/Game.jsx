import GameAvatar from "src/assets/images/game.png";
import cn from "classnames/bind";
import styles from "./Game.module.scss";
import { Typography, Checkbox } from "@mui/material";
import { setFilter } from "src/lib/redux/slices/filter";
import { useDispatch, useSelector } from "react-redux";

const cx = cn.bind(styles);

export default function Game({ game, active }) {
	const dispatch = useDispatch();
	const activeGames = useSelector(state => state?.filter) || [];

	const onClick = () => {
		if (activeGames.length && activeGames.find(item => item.gameAddress === game.gameAddress)) {
			let arr = activeGames.filter(item => item.gameAddress !== game.gameAddress)
			dispatch(setFilter([...arr]));
		} else {
			dispatch(setFilter([...activeGames, game]));
		}
	};

	return (
		<>
			<div className={cx("game")} onClick={onClick}>
				<img src={game.logoUrl} className={cx("avatar", active && "active")} />
				<Typography variant="body1" className={cx("name", active && "active")}>
					{game.gameName}
				</Typography>
			</div>
			{/* <div className={cx("attribute")}>
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
			</div> */}
		</>
	);
}
