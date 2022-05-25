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
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Button } from "@mui/material";
import kwtToken from "src/assets/icons/kwt.png";
import BuyModal from "./BuyModal";
import formatNumber from "src/utils/formatNumber";
import { BSC_rpcUrls } from "src/constants/blockchain";
import Web3 from "web3";

const web3 = new Web3(BSC_rpcUrls);

const cx = cn.bind(styles);

const NFTDetail = ({ hasPrice }) => {
	const navigate = useNavigate();

	const { nftId, address } = useParams();
	const [nftInfo, setNftInfo] = useState();
	const [loading, setLoading] = useState(true);
	const { pathname } = useLocation();
	const [showBuyModal, setShowBuyModal] = useState(false);

	useEffect(() => {
		getNftInfo();
	}, []);

	let pathnames = pathname.split("/").filter(Boolean);
	pathnames.splice(5, 1);
	pathnames.splice(2, 1);

	const getNftInfo = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${URL}/v1/nft/${address.toLowerCase()}/${nftId}`);
			setNftInfo(res.data.data);
			console.log(res.data.data);
			console.log("res :>> ", res);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	return (
		<div className={cx("nft-detail")}>
			{/* <div className={cx("breadcrums")}>
				{" "}
				<Breadcrumbs separator={<NavigateNextIcon />} aria-label="breadcrumb">
					{pathnames.map((name, index) => {
						if (index === 3) return;
						let routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
						if (index === 1) {
							routeTo = routeTo + `/${pathnames[2]}?view=true`;
						}
						return (
							<span
								key={name}
								onClick={() => {
									if (index === 2) {
										return;
									}
									navigate(routeTo);
								}}>
								{name}
							</span>
						);
					})}
				</Breadcrumbs> 
			</div> */}

			<div className={cx("main-content")}>
				<div className={cx("left")}>
					{/* <div className={cx("back")} onClick={() => navigate(-1)}>
						<ArrowBackIosNewRoundedIcon style={{ color: "#833F1D" }} />
					</div> */}

					<div className={cx("image-box")}>
						<img src={nftInfo?.imageUrl ? nftInfo.imageUrl : defaultImage} alt="nft" />
					</div>
				</div>
				<div className={cx("right")}>
					<div className={cx("title")}>
						<div className={cx("tokenId")}>#{nftInfo?.tokenId}</div>
						<div className={cx("name")}>{nftInfo?.name || "NFT name"}</div>
						<div className={cx("text")}>Category: {nftInfo?.category}</div>
						<div className={cx("text")}>Supply: {nftInfo?.supply}</div>
						<div className={cx("text")}>
							Author: {nftInfo?.author?.slice(0, 8) + "..." + nftInfo?.author?.slice(-8)}
						</div>
					</div>
					{!hasPrice && (
						<div className={cx("description")}>
							<div className={cx("subtitle")}>Price:</div>
							<div className={cx("content", "price")}>
								<div className={cx("number")}>
									<img src={kwtToken} alt="kwt-token" width={28} height={28} />
									<span className={cx("num-token")}>123</span>
									<span className={cx("usd")}>$123</span>
								</div>
								<Button className={cx("btn-buy")} onClick={() => setShowBuyModal(true)}>
									Buy NFT
								</Button>
							</div>
						</div>
					)}

					<BuyModal show={showBuyModal} setShow={setShowBuyModal} info={nftInfo} />

					<div className={cx("description")}>
						<div className={cx("subtitle")}>Description:</div>
						<div className={cx("content")}>{nftInfo?.description}</div>
					</div>
					<div className={cx("description")}>
						<div className={cx("subtitle")}>Attributes:</div>
						<div className={cx("content")} style={{ padding: 0 }}>
							<div className={cx("attribute-table")}>
								<Grid container className={cx("tb-header")}>
									<Grid item xs={3}>
										Image
									</Grid>
									<Grid item xs={5}>
										Name
									</Grid>
									<Grid item xs={4}>
										Value
									</Grid>
								</Grid>

								<div className={cx("divider")}></div>

								{nftInfo?.attributes?.length > 0 && nftInfo?.attributes[0]?.type ? (
									<div className={cx("list-attribute")}>
										<div>
											{nftInfo?.attributes
												.filter(item => item.valueType === "Text")
												?.map((info, ind) => (
													<Grid container className={cx("tb-row")} key={ind}>
														<Grid item xs={3}>
															<img
																src={info?.image ? info?.image : defaultImage}
																alt="attr"
																className={cx("attr-image")}
															/>
														</Grid>
														<Grid item xs={5}>
															{info?.type}
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
														<Grid item xs={3}>
															<img
																src={info?.image ? info?.image : defaultImage}
																alt="attr"
																className={cx("attr-image")}
															/>
														</Grid>
														<Grid item xs={5}>
															{info?.type}
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
								) : (
									<div className={cx("no-attribute")}>No attributes</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NFTDetail;
