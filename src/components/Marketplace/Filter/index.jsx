import { Box, InputAdornment, Typography, OutlinedInput } from "@mui/material";
import FilterIcon from "src/assets/icons/filter.svg";
import SearchIcon from "@mui/icons-material/Search";
import Game from "./Game";
import styles from "./index.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

export default function Filter() {
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
			<Game />
			<Game />
		</div>
	);
}
