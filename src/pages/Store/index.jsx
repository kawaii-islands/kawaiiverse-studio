import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Button } from "@mui/material";
import { read } from "src/services/web3";
import { BSC_CHAIN_ID } from "src/constants/blockchain";
import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useWeb3React } from "@web3-react/core";
import { FACTORY_ADDRESS } from "src/constants/address";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import { KAWAIIVERSE_STORE_ADDRESS } from "src/constants/address";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import { KAWAII1155_ADDRESS } from "src/constants/constant";
import { URL } from "src/constants/constant";
import cancel from "src/assets/icons/cancel.svg";
import List from "src/components/Marketplace/List";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import Filter from "src/components/Marketplace/Filter";
import Toolbar from "src/components/Marketplace/Toolbar";
import { useQuery } from "react-query";
import { getListSellingGame } from "src/lib/web3";
import { useSelector } from "react-redux";

const cx = cn.bind(styles);

const PAGE_SIZE = 15;
const Profile = () => {
	const [loadingListNFT, setLoadingListNFT] = useState(true);
	const [gameList, setGameList] = useState([]);
	const [gameSelected, setGameSelected] = useState([]);
	const [listNft, setListNft] = useState([]);
	const [originalList, setOriginalList] = useState([]);
	const firstUpdate = useRef(true);
	const { error, isLoading, data } = useQuery("getListSellingGame", getListSellingGame);
	const activeGames = useSelector(state => state?.filter) || [];

	useEffect(() => {
		setGameList(data);
	}, [data]);

	useEffect(() => {
		logGameData();
	}, [activeGames, gameList]);

	useLayoutEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		} else {
			logGameData();
		}
	}, [gameSelected]);

	const getGameItemLength = async gameAddress => {
		let length;
		length = await read("lengthSellNFT1155", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [gameAddress]);
		return length;
	};

	const getGameItemData = async (gameAddress, gameIndex) => {
		let gameData;
		gameData = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
			gameAddress,
			gameIndex,
		]);
		return gameData;
	};

	const mergeArrayData = (dataArray1, dataArray2) => {
		let mergedArray = dataArray1.map((nft1, idx1) => {
			let nft = nft1;
			dataArray2.map((nft2, idx2) => {
				if (Number(nft1.tokenId) === Number(nft2.tokenId)) {
					nft = { ...nft2, ...nft1 };
				}
			});

			return nft;
		});
		return mergedArray;
	};

	const logGameData = async () => {
		try {
			let game;
			if (activeGames?.length) {
				game = activeGames;
			} else {
				game = gameList;
			}
			if (!game) return;

			setLoadingListNFT(true);

			const tmpGameArray = Array(game.length).fill(1);
			const gameListData = await Promise.all(
				tmpGameArray.map(async (nftId, idx) => {
					let gameItemLength = await getGameItemLength(game[idx].gameAddress);
					const tmpItemArray = Array(Number(gameItemLength)).fill(1);
					let res = await axios.get(`${URL}/v1/nft/${game[idx].gameAddress}`);
					if (res.status === 200) {
						const gameItemData = await Promise.all(
							tmpItemArray.map(async (nftId, index) => {
								let gameItem = await getGameItemData(game[idx].gameAddress, index);

								gameItem.index = index;
								gameItem.game = game[idx];
								return gameItem;
							})
						);
						let mergeArray = mergeArrayData(gameItemData, res.data.data);
						mergeArray = mergeArray.filter(nft => {
							return nft.contract && Number(nft?.amount) - Number(nft?.alreadySale) > 0;
						});
						return mergeArray;
					}
				})
			);

			setOriginalList(gameListData.flat(3));
			setListNft(gameListData.flat(3));
			setLoadingListNFT(false);
			return gameListData.flat(3);
		} catch (error) {
			console.log(error);
			toast.error(error.message || "An error occurred!");
		} finally {
		}
	};

	return (
		<div className={cx("profile")}>
			<div className={cx("row")}>
				<div className={cx("left")}>
					<Filter />
				</div>

				<div className={cx("right")}>
					<Toolbar listNft={listNft} setListNft={setListNft} originalList={originalList} />

					<div className={cx("list")}>
						{loadingListNFT ? (
							<ListSkeleton page={"store"} />
						) : (
							<List listNft={listNft.reverse()} hasPrice={true} canBuy={true} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
