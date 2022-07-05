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
import FilterIcon from "src/assets/icons/filter.svg";

const cx = cn.bind(styles);

const names = ["Price: Low to High", "Price: High to Low", "Newest", "Oldest"];

export default function Toolbar({ listNft, setListNft, originalList }) {
	const dispatch = useDispatch();
	const [sort1, setSort] = useState(names[2]);
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

	const handleSort = sort => {
		if (sort === sort1) {
			setSort("");
			setListNft(originalList);
			if (search !== "") {
				let listSearch = listNft.filter(nft => {
					if (nft.name) {
						return nft?.name.toUpperCase().includes(search.toUpperCase()) || nft?.tokenId.toString().includes(search);
					}
					return false;
				});
				setListSearch([...listSearch]);
			}
			return;
		}

		setSort(sort);
		let newList = search !== "" ? [...listSearch] : [...listNft];

		if (sort === 0) {
			newList = newList.sort(function (a, b) {
				return Number(a.price) - Number(b.price);
			});
		}

		if (sort === 1) {
			newList = newList.sort(function (a, b) {
				return Number(b.price) - Number(a.price);
			});
		}

		if (sort === 2) {
			newList = [...originalList];
		}

		if (sort === 3) {
			newList = [...originalList].reverse();
		}

		if (search !== "") {
			setListSearch(newList);
			return;
		}
		setListNft(newList);
	};

	return (
		<>
			<Box className={cx("toolbar")}>
				<Box sx={{ display: "flex", alignContent: "center", justifyContent: "space-between" }}>
					<Box sx={{ display: "flex", alignContent: "center" }}>
						<Typography variant="h6" className={cx("total")}>
							{listNft?.length} Items
						</Typography>
					</Box>
					<div className={cx("filter-mobile")}>
						<img src={FilterIcon} alt="filter-icon" />
					</div>
				</Box>
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
				{/* <FormControl>
					<Select
						className={cx("sort")}
						displayEmpty
						input={<OutlinedInput />}
						value={sort1}
						onChange={e => setSort(e.target.value)}
						size="small">
						{names.map((name, id) => (
							<MenuItem key={name} value={name} className={cx("item")} onClick={() => handleSort(id)}>
								{name}
							</MenuItem>
						))}
					</Select>
				</FormControl> */}
			</Box>

			{activeGames.length > 0 && (
				<div style={{ display: "flex", alignItems: "center", marginTop: "12px", flexWrap: "wrap" }}>
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
