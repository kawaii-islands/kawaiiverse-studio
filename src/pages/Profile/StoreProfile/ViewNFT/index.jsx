import React, { useEffect, useState } from "react";
import styles from "../../ManageNft/ViewNFT/ViewNFT.module.scss";
import cn from "classnames/bind";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import List from "src/components/Marketplace/List";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "src/constants/constant";
import { Search as SearchIcon } from "@material-ui/icons";
import { toast } from "react-toastify";
import noData from "src/assets/icons/noData.png";
import { Input, OutlinedInput, InputAdornment, MenuItem, FormControl, Select, Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { read } from "src/services/web3";
import { BSC_CHAIN_ID } from "src/constants/blockchain";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import { KAWAIIVERSE_STORE_ADDRESS } from "src/constants/address";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";

const cx = cn.bind(styles);

const names = ["Price: Low to High", "Price: High to Low", "Newest", "Oldest"];

const ViewNFT = ({ gameSelected, setIsSellNFT, isSellNFT }) => {
	const navigate = useNavigate();
	const { account } = useWeb3React();
	const { address } = useParams();

	const [loading, setLoading] = useState(true);
	const [listNftByContract, setListNftByContract] = useState();
	const [listNft, setListNft] = useState();
	const [search, setSearch] = useState("");
	const [sort1, setSort] = useState(names[2]);
	const [originalList, setOriginalList] = useState([]);
	const [listSearch, setListSearch] = useState([]);
	const [gameItemList, setGameItemList] = useState([]);
	const [loadingListNFT, setLoadingListNFT] = useState(true);

	useEffect(() => {
		getListNft();
	}, [account, address, isSellNFT]);

	const getListNftByContract = async () => {
		setLoading(true);

		try {
			const res = await axios.get(`${URL}/v1/nft/${gameSelected.toLowerCase()}`);
			if (res.status === 200) {
				let data = res.data.data.reverse();
				setListNftByContract(data);
				setListNft(data);
				setOriginalList(data);
				setLoading(false);
			}
		} catch (err) {
			toast.error(err);
			console.log(err);
		}
	};

	const handleSearch = e => {
		let arr = [...originalList];
		let result = arr?.filter((nft, idx) => {
			let condition1 = nft?.tokenId.toString().includes(e.target.value);
			let condition2 = nft?.name.toUpperCase().includes(e.target.value.toUpperCase());
			let condition3 = nft?.author.toUpperCase().includes(e.target.value.toUpperCase());
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

	const getGameList = async () => {
		if (account) {
			try {
				const totalGame = await read(
					"lengthListNFT1155",
					BSC_CHAIN_ID,
					KAWAIIVERSE_STORE_ADDRESS,
					KAWAII_STORE_ABI,
					[]
				);
				const tmpArray = Array.from({ length: totalGame }, (v, i) => i);
				const gameListData = await Promise.all(
					tmpArray.map(async (nftId, index) => {
						let gameAddress = await read("listNFT1155", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
							index,
						]);
						let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
						return { gameAddress, gameName };
					})
				);
				// setGameList(gameListData);
				console.log(gameListData);
				return gameListData;
			} catch (error) {
				console.log(error);
				toast.error(error.message || "An error occurred!");
			}
		}
	};
	const getNftList = async gameList => {
		if (!account) return;
		const tmpGameArray = [...Array(address ? 1 : gameList.length).keys()];
		try {
			const list = [];
			let myNftList = [];
			const gameListData = await Promise.all(
				tmpGameArray.map(async (nftId, idx) => {
					let gameItemLength = await read(
						"lengthSellNFT1155",
						BSC_CHAIN_ID,
						KAWAIIVERSE_STORE_ADDRESS,
						KAWAII_STORE_ABI,
						[address ? address : gameList[idx].gameAddress]
					);
					const tmpItemArray = Array.from({ length: gameItemLength }, (v, i) => i);
					const gameItemData = await Promise.all(
						tmpItemArray.map(async (nftId, index) => {
							let gameItem = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
								address ? address : gameList[idx].gameAddress,
								index,
							]);
							// let itemInfo = getItemInfo(gameItem.tokenId);
							list.push(Object.assign({ index: index }, gameItem));
							return Object.assign({ index: index }, gameItem);
						})
					);
					// console.log(gameItemData);
					// let myNftList = [];

					if (gameItemData?.length) {
						myNftList = gameItemData?.filter(nft => nft.owner === account);
					}
				})
			);

			// let myNftList = [];

			return myNftList;
		} catch (error) {
			console.log(error);
			toast.error(error.message || "An error occurred!");
		}
	};

	const getListNft = async () => {
		setLoadingListNFT(true);
		try {
			if (!account || !address) return;
			const res = await axios.get(`${URL}/v1/nft/${address.toLowerCase()}`);

			if (res.status === 200) {
				let allList = res.data.data;
				const gameList = await getGameList();
				let nftSaleList = await getNftList(gameList);
				nftSaleList = nftSaleList?.filter(nft => {
					return nft.nftAddress === address && nft.owner === account;
				});
				// return;
				for (let i = 0; i < nftSaleList?.length; i++) {
					for (let j = 0; j < allList?.length; j++) {
						if (Number(nftSaleList[i].tokenId) === Number(allList[j].tokenId)) {
							nftSaleList[i] = { ...nftSaleList[i], ...allList[j] };
						}
					}
				}

				setOriginalList([...nftSaleList].reverse());
				setGameItemList([...nftSaleList].reverse());
				setListNft([...nftSaleList].reverse());
				setLoadingListNFT(false);
				setLoading(false);
			} else {
				toast.error("Cannot get list Nft");
			}
		} catch (error) {
			setLoadingListNFT(false);
			console.log(error);
			toast.error(error);
		}
	};

	return (
		<div className={cx("view-nft")}>
			<div className={cx("top")}>
				<div className={cx("left-title")}>
					<div className={cx("title")}>{listNft?.length} Items</div>
					<Input
						disableUnderline
						placeholder="Search for NFT"
						className={cx("search")}
						endAdornment={
							<InputAdornment position="end">
								<SearchIcon className={cx("icon")} />
							</InputAdornment>
						}
						onChange={e => handleSearch(e)}
					/>
				</div>

				<div className={cx("group-search")}>
					<FormControl>
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
					</FormControl>

					<Button
						className={cx("button")}
						onClick={() => {
							navigate({ search: "?view=false" });
							setIsSellNFT(true);
						}}>
						Sell NFT
					</Button>
				</div>
			</div>

			<div className={cx("list-nft")}>
				{loading ? (
					<ListSkeleton />
				) : listNft.length > 0 ? (
					<div className={cx("list-nft")}>
						<List listNft={listNft} gameSelected={gameSelected} hasPrice={true} canBuy={false} />
					</div>
				) : (
					<div style={{ textAlign: "center", width: "100%" }}>
						<img src={noData} alt="no-data" />
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewNFT;
