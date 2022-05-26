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
import { useEffect, useState } from "react";
import GameAvatar from "src/assets/images/game.png";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "src/lib/redux/slices/filter";

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

export default function Toolbar({ listNft, setListNft, originalList }) {
	const dispatch = useDispatch();
	const [sort, setSort] = useState("Oliver Hansen");
	const activeGames = useSelector(state => state?.filter) || [];
	const [searchValue, setSearchValue] = useState();

	const onDelete = gameAddress => {
		let arr = activeGames.filter(item => item.gameAddress !== gameAddress);
		dispatch(setFilter([...arr]));
	};

	const clearAll = () => {
		dispatch(setFilter([]));
	};

	const handleSearch = value => {
		let arr = [...originalList];
		setSearchValue(value);

		let result = arr.filter((nft, idx) => {
			let condition1 = nft?.tokenId.toString().includes(value);
			let condition2 = nft?.name.toUpperCase().includes(value.toUpperCase());
			let condition3 = nft?.author.toUpperCase().includes(value.toUpperCase());

			return condition1 || condition2 || condition3;
		});

		setListNft([...result]);
	};

	return (
		<>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
				<Box sx={{ display: "flex", alignContent: "center" }}>
					<Typography variant="h6" className={cx("total")}>
						{listNft?.length} Items
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
						// value={searchValue}
						onChange={e => handleSearch(e.target.value)}
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

			{activeGames.length > 0 && (
				<div style={{ display: "flex", alignItems: "center" }}>
					{activeGames.map((game, idx) => (
						<Box display="flex" alignItems="center" flexWrap="wrap" key={idx}>
							<Chip
								className={cx("tag")}
								variant="outlined"
								onDelete={() => onDelete(game.gameAddress)}
								label={
									<Typography variant="body2" className={cx("text")}>
										{game.gameName}
									</Typography>
								}
								avatar={<Avatar src={game.logoUrl} className={cx("avatar")} />}
							/>
						</Box>
					))}
					<Button className={cx("clear")} onClick={clearAll}>
						CLEAR ALL
					</Button>
				</div>
			)}
		</>
	);
}
