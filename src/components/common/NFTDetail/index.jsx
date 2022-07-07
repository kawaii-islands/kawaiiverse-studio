import { Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import closeIcon from "src/assets/icons/close-icon.svg";
import Grid from "@mui/material/Grid";
import { useParams, useNavigate, useLocation, Navigate } from "react-router-dom";
import { URL } from "src/constants/constant";
import axios from "axios";
import defaultImage from "src/assets/icons/default_image.svg";
import { Button } from "@mui/material";
import kwtToken from "src/assets/icons/kwt.png";
import BuyModal from "./BuyModal";
import formatNumber from "src/utils/formatNumber";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/constants/blockchain";
import Web3 from "web3";
import { read } from "src/lib/web3";
import { KAWAIIVERSE_STORE_ADDRESS } from "src/constants/address";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const web3 = new Web3(BSC_rpcUrls);

const cx = cn.bind(styles);

const NFTDetail = () => {
	const { account } = useWeb3React();
	const navigate = useNavigate();
	const { kwtPrice } = useSelector(state => state?.price);
	const { nftId, address, index } = useParams();
	const [nftInfo, setNftInfo] = useState();
	const [loading, setLoading] = useState(true);
	const { pathname } = useLocation();
	const [showBuyModal, setShowBuyModal] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const hasPrice = searchParams.get("hasPrice");
	const canBuy = searchParams.get("canBuy");

	useEffect(() => {
		if (index) {
			getBuyNftInfo();
		} else {
			getNftInfo();
		}
	}, [address, nftId, index]);

	let pathnames = pathname.split("/").filter(Boolean);
	pathnames.splice(5, 1);
	pathnames.splice(2, 1);

	const getNftInfo = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL}/v1/nft/${address.toLowerCase()}/${nftId}`);
			setNftInfo(res.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getBuyNftInfo = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL}/v1/nft/${address.toLowerCase()}/${nftId}`);

			let gameItem = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
				address,
				index,
			]);
			console.log("gameItem :>> ", gameItem);
			if (res.status === 200) {
				gameItem = { ...gameItem, ...res.data.data };
			}

			setNftInfo(gameItem);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	const buyNft = () => {
		if (!account) {
			toast.error("Connect wallet first !");
			return;
		}

		setShowBuyModal(true);
	};

	return (
		<div className={cx("nft-detail")}>
			<div className={cx("main-content")}>
				<div className={cx("left")}>
					<div className={cx("image-box")}>
						<img src={nftInfo?.imageUrl} alt="nft" />
					</div>
				</div>
				<div className={cx("right")}>
					<div className={cx("title")}>
						<div className={cx("tokenId")}>#{nftInfo?.tokenId}</div>
						<div className={cx("name")}>{nftInfo?.name || "NFT name"}</div>
						<div className={cx("text")}>Category: {nftInfo?.category}</div>
						<div className={cx("text")}>Rarity: {nftInfo?.rarity}</div>
						<div className={cx("text")}>Supply: {nftInfo?.supply}</div>
						{nftInfo?.alreadySale && (
							<div className={cx("text")}>Available: {Number(nftInfo?.amount) - Number(nftInfo?.alreadySale)}</div>
						)}
						<div className={cx("text")}>
							Author: {nftInfo?.author?.slice(0, 8) + "..." + nftInfo?.author?.slice(-8)}
						</div>
					</div>
					{nftInfo?.price && (
						<div className={cx("description")}>
							<div className={cx("subtitle")}>Price:</div>
							<div className={cx("content", "price")}>
								<div className={cx("number")}>
									<img src={kwtToken} alt="kwt-token" width={28} height={28} />
									<span className={cx("num-token")}>{web3.utils.fromWei(nftInfo?.price)}</span>
									<span className={cx("usd")}>
										${nftInfo?.price && formatNumber(Number(web3.utils.fromWei(nftInfo?.price.toString())) * kwtPrice)}
									</span>
								</div>
								{canBuy === "true" && (
									<Button className={cx("btn-buy")} onClick={buyNft}>
										Buy NFT
									</Button>
								)}
							</div>
						</div>
					)}

					<BuyModal show={showBuyModal} setShow={setShowBuyModal} info={nftInfo} />

					{nftInfo?.description && (
						<div className={cx("description")}>
							<div className={cx("subtitle")}>Description:</div>
							<div className={cx("content")}>{nftInfo?.description}</div>
						</div>
					)}

					{nftInfo?.attributes?.length > 0 && nftInfo?.attributes[0]?.type && (
						<div className={cx("description")}>
							<div className={cx("subtitle")}>Attributes:</div>
							<div className={cx("content")} style={{ padding: 0 }}>
								<div className={cx("attribute-table")}>
									<Grid container className={cx("tb-header")}>
										<Grid item xs={5}>
											Name
										</Grid>
										<Grid item xs={3}>
											Image
										</Grid>
										<Grid item xs={4}>
											Value
										</Grid>
									</Grid>

									<div className={cx("divider")}></div>

									<div className={cx("list-attribute")}>
										<div>
											{nftInfo?.attributes
												.filter(item => item.valueType === "Text")
												?.map((info, ind) => (
													<Grid container className={cx("tb-row")} key={ind}>
														<Grid item xs={5}>
															{info?.type}
														</Grid>
														<Grid item xs={3}>
															<img
																src={info?.image ? info?.image : defaultImage}
																alt="attr"
																className={cx("attr-image")}
															/>
														</Grid>
														<Grid item xs={4}>
															{info?.value}
														</Grid>
													</Grid>
												))}
										</div>
										<div>
											{nftInfo?.attributes
												.filter(item => item.valueType === "Image")
												?.map((info, ind) => (
													<Grid container className={cx("tb-row")} key={ind}>
														<Grid item xs={5}>
															{info?.type}
														</Grid>
														<Grid item xs={3}>
															<img
																src={info?.image ? info?.image : defaultImage}
																alt="attr"
																className={cx("attr-image")}
															/>
														</Grid>
														<Grid item xs={4}>
															<img
																src={info?.value ? info?.value : defaultImage}
																alt="attr"
																className={cx("attr-image")}
															/>
														</Grid>
													</Grid>
												))}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default NFTDetail;
