import { slide as Menu } from "react-burger-menu";
import { Box, InputAdornment, Typography, OutlinedInput } from "@mui/material";
import FilterIcon from "src/assets/icons/filter.svg";
import SearchIcon from "@mui/icons-material/Search";
import Game from "./Game";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { getListGame, getListSellingGame } from "src/lib/web3";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setGames } from "src/lib/redux/slices/game";
import { useEffect, useState } from "react";

const cx = cn.bind(styles);

export default function FilterMobile({ isOpen, setIsOpen }) {
	const [listGame, setListGame] = useState([]);
	const dispatch = useDispatch();
	const activeGames = useSelector(state => state?.filter) || [];
	const { error, isLoading, data } = useQuery("getListSellingGame", getListSellingGame);
	if (data) dispatch(setGames(data));

	useEffect(() => {
		setListGame(data);
	}, [data]);

	const handleSearch = value => {
		let result = data.filter(game => game.gameName.toLowerCase().includes(value.toLowerCase()));
		setListGame([...result]);
	};

	return (
		<Menu
			className={cx("container", "filter-mobile")}
			right
			width={"280px"}
			isOpen={isOpen}
			onOpen={setIsOpen(!isOpen)}
			onClose={setIsOpen(false)}>
			<div style={{ display: "flex" }}>
				<img src={FilterIcon} />
				<Typography variant="h5" className={cx("title")}>
					Filter
				</Typography>
			</div>
			{listGame &&
				listGame.map(game => (
					<Game
						key={game.gameAddress}
						game={game}
						active={activeGames.length && activeGames?.find(item => item.gameAddress === game.gameAddress)}
					/>
				))}
		</Menu>
	);
}
