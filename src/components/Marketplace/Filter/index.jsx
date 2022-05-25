import { Box, InputAdornment, Typography, OutlinedInput } from "@mui/material";
import FilterIcon from "src/assets/icons/filter.svg";
import SearchIcon from "@mui/icons-material/Search";
import Game from "./Game";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { getListGame } from "src/lib/web3";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setGames } from "src/lib/redux/slices/game";

const cx = cn.bind(styles);

export default function Filter() {
	const dispatch = useDispatch();
	const activeGames = useSelector(state => state?.filter?.games) || [];
	const { error, isLoading, data } = useQuery("getListGame", getListGame);
	if (data) dispatch(setGames(data));

	return (
		<div className={cx("container")}>
			<Box display="flex">
				<img src={FilterIcon} />
				<Typography variant="h5" className={cx("title")}>
					Filter
				</Typography>
			</Box>
			<OutlinedInput
				className={cx("search")}
				startAdornment={
					<InputAdornment position="start">
						<SearchIcon htmlColor="#B8A4A1" />
					</InputAdornment>
				}
				placeholder="Search game"
			/>
			{data && data.map(game => <Game key={game.address} game={game} active={activeGames.includes(game.address)} />)}
		</div>
	);
}
