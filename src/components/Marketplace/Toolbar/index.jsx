import {
	Box,
	Typography,
	OutlinedInput,
	InputAdornment,
	MenuItem,
	FormControl,
	Avatar,
	Select,
	Chip,
	Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import GameAvatar from "src/assets/images/game.png";
import styles from "./index.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

const names = [
	"Oliver Hansen",
	"Van Henry",
	"April Tucker",
	"Ralph Hubbard",
	"Omar Alexander",
	"Carlos Abbott",
	"Miriam Wagner",
	"Bradley Wilkerson",
	"Virginia Andrews",
	"Kelly Snyder",
];

export default function Toolbar() {
	const [sort, setSort] = useState("Oliver Hansen");
	return (
		<>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
				<Box sx={{ display: "flex", alignContent: "center" }}>
					<Typography variant="h6" className={cx("total")}>
						2000 Items
					</Typography>
					<OutlinedInput
						className={cx("search")}
						variant="filled"
						placeholder="Search for NFT"
						endAdornment={
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						}
					/>
				</Box>
				<FormControl>
					<Select
						className={cx("sort")}
						displayEmpty
						input={<OutlinedInput />}
						value={sort}
						onChange={e => setSort(e.target.value)}
						size="small">
						{names.map(name => (
							<MenuItem key={name} value={name} className={cx("item")}>
								{name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
			<Box display="flex" alignItems="center" marginBottom="30px" flexWrap="wrap">
				<Chip
					className={cx("tag")}
					variant="outlined"
					onDelete={() => {}}
					label={
						<Typography variant="body2" className={cx("text")}>
							Kawaii Islands
						</Typography>
					}
					avatar={<Avatar src={GameAvatar} className={cx("avatar")} />}
				/>
				<Chip
					className={cx("tag")}
					variant="outlined"
					onDelete={() => {}}
					label={
						<Typography variant="body2" className={cx("text")}>
							Kawaii Islands
						</Typography>
					}
					avatar={<Avatar src={GameAvatar} className={cx("avatar")} />}
				/>
				<Chip
					className={cx("tag")}
					variant="outlined"
					onDelete={() => {}}
					label={
						<Typography variant="body2" className={cx("text")}>
							Kawaii Islands
						</Typography>
					}
					avatar={<Avatar src={GameAvatar} className={cx("avatar")} />}
				/>
				<Chip
					className={cx("tag")}
					variant="outlined"
					onDelete={() => {}}
					label={
						<Typography variant="body2" className={cx("text")}>
							Kawaii Islands
						</Typography>
					}
					avatar={<Avatar src={GameAvatar} className={cx("avatar")} />}
				/>
				<Chip
					className={cx("tag")}
					variant="outlined"
					onDelete={() => {}}
					label={
						<Typography variant="body2" className={cx("text")}>
							Kawaii Islands
						</Typography>
					}
					avatar={<Avatar src={GameAvatar} className={cx("avatar")} />}
				/>
				<Button className={cx("clear")}>CLEAR ALL</Button>
			</Box>
		</>
	);
}
