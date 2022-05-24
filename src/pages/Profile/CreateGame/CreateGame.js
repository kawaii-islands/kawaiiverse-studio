import React, { useEffect, useState } from "react";
import styles from "./CreateGame.module.scss";
import Grid from "@mui/material/Grid";
import cn from "classnames/bind";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import { URL } from "src/constants/constants";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Item from "./Item";
import { create } from "ipfs-http-client";
import logoCreate from "src/assets/icons/plus1.png";
import { useWeb3React } from "@web3-react/core";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/constants/network";
import { FACTORY_ADDRESS } from "src/constants/address";
import FACTORY_ABI from "src/utils/abi/KawaiiFactory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { read, createNetworkOrSwitch, write } from "src/services/web3";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import logoSuccess from "src/assets/images/success.png";
import logoFailed from "src/assets/images/error1.png";
import logoLoading from "src/assets/images/loading1.png";
import addImage from "src/assets/images/add.png";
import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const cx = cn.bind(styles);
const client = create("https://ipfs.infura.io:5001/api/v0");
const PAGE_SIZE = 8;

const CreateGame = () => {
	const [open, setOpen] = useState(false);
	const { account, chainId, library } = useWeb3React();
	const [gameList, setGameList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalGame, setTotalGame] = useState();
	const [loadingGameList, setLoadingGameList] = useState(false);
	const [success, setSuccess] = useState(false);
	const [failed, setFailed] = useState(false);
	const [uploadImageLoading, setUploadImageLoading] = useState(false);
	const [uploadGameLoading, setUploadGameLoading] = useState(false);
	const [errorName, setErrorName] = useState(false);
	const [errorSymbol, setErrorSymbol] = useState(false);
	const [errorImage, setErrorImage] = useState(false);
	const [gameInfo, setgameInfo] = useState({});
	const [fileName, setFileName] = useState();
	const [fileUrl, setFileUrl] = useState();
	const [fileSize, setFileSize] = useState();

	useEffect(() => {
		logInfo();
	}, [account]);

	const logInfo = async type => {
		if (!account) return;
		console.log(Date.now());
		setGameList([]);
		setLoadingGameList(true);
		try {
			let lists = [];
			let upperBoundary;
			const totalGame = await read("nftOfUserLength", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account]);
			if ((currentPage - 1) * PAGE_SIZE + PAGE_SIZE > totalGame) {
				upperBoundary = totalGame;
			} else {
				upperBoundary = (currentPage - 1) * PAGE_SIZE + PAGE_SIZE;
			}
			setTotalGame(totalGame);
			for (let index = (currentPage - 1) * PAGE_SIZE; index < upperBoundary; index++) {
				let gameAddress = await read("nftOfUser", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account, index]);
				let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
				console.log(gameAddress, gameName);
				const res = await axios.get(`${URL}/v1/game/logo?contract=${gameAddress}`);
				let gameUrl = "";
				if (res.data.data[0]) {
					gameUrl = res.data.data[0].logoUrl;
				}
				lists.push({ gameAddress, gameName, gameUrl });
			}
			setGameList(lists.reverse());
		} catch (err) {
			console.log(err);
			setLoadingGameList(false);
		} finally {
			setLoadingGameList(false);
		}
	};

	const handleOpen = () => setOpen(true);

	const handleClose = () => {
		setOpen(false);
		setSuccess(false);
	};

	const inputChangeHandler = (key, value) => {
		setgameInfo({ ...gameInfo, [key]: value });
	};

	const handleChangeName = e => {
		if (e.target.value) {
			setErrorName(false);
		} else setErrorName(true);
		inputChangeHandler("name", e.target.value);
	};

	const handleChangeSymbol = e => {
		if (e.target.value) {
			setErrorSymbol(false);
		} else setErrorSymbol(true);
		inputChangeHandler("symbol", e.target.value);
	};

	const checkImageSize = size => {
		if (size > 5000) {
			setErrorImage(true);
			return false;
		}
		return true;
	};

	const handleUploadImage = async e => {
		setUploadImageLoading(true);

		if (e.target.files[0]) {
			setErrorImage(false);
		} else {
			setErrorImage(true);
			setUploadImageLoading(false);
			return;
		}

		const imageSize = Math.round(e.target.files[0].size / 1024);
		const file = e.target.files[0];
		setFileName(e.target.files[0].name);
		setFileSize(imageSize);

		if (!checkImageSize(imageSize)) {
			setUploadImageLoading(false);
			return;
		}
		try {
			const added = await client.add(file);
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;
			setFileUrl(url);
			inputChangeHandler("avatar", url);
		} catch (error) {
			console.log("Error uploading file: ", error);
		} finally {
			setUploadImageLoading(false);
		}
	};

	const checkValidation = () => {
		let valid = true;

		if (gameInfo.name) setErrorName(false);
		else {
			setErrorName(true);
			valid = false;
		}

		if (gameInfo.symbol) setErrorSymbol(false);
		else {
			setErrorSymbol(true);
			valid = false;
		}

		if (gameInfo.avatar && fileSize <= 5000) setErrorImage(false);
		else {
			setErrorImage(true);
			valid = false;
		}

		return valid;
	};

	const sign = async (account, data, provider) => {
		let res = await provider.send("eth_signTypedData_v4", [account, data]);
		return res.result;
	};

	const getSignature = async (gameAddress, imageUrl) => {
		const EIP712Domain = [
			{
				name: "domain",
				type: "string",
			},
			{
				name: "version",
				type: "string",
			},
			{
				name: "time",
				type: "uint256",
			},
		];

		const domain = {
			domain: "http://kawaiiverse.io",
			version: "1",
			time: Date.now(),
		};

		const Data = [
			{
				name: "contract",
				type: "address",
			},
			{
				name: "logoUrl",
				type: "string",
			},
		];

		const message = {
			contract: gameAddress,
			logoUrl: imageUrl,
		};

		const data = JSON.stringify({
			types: {
				EIP712Domain,
				Data,
			},
			domain,
			primaryType: "Data",
			message,
		});

		const signature = await sign(account, data, library.provider);
		return signature;
	};

	const handleCreate = async () => {
		setUploadGameLoading(true);
		if (checkValidation()) {
			try {
				if (chainId !== BSC_CHAIN_ID) {
					console.log(chainId, BSC_CHAIN_ID);
					const error = await createNetworkOrSwitch(library.provider);
					console.log(error);
					if (error) {
						throw new Error("Please change network to Testnet Binance smart chain.");
					}
				}

				await write(
					"createNFT1155",
					library.provider,
					FACTORY_ADDRESS,
					FACTORY_ABI,
					[account, gameInfo.name, gameInfo.symbol, Date.now()],
					{ from: account },
					hash => {
						console.log(hash);
					}
				);

				const totalGame = await read("nftOfUserLength", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account]);
				let gameAddress = await read("nftOfUser", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account, totalGame - 1]);
				const signature = await getSignature(gameAddress, gameInfo.avatar);

				let bodyParams = {
					contract: gameAddress,
					logoUrl: gameInfo.avatar,
					sign: signature,
				};

				const res = await axios.post(`${URL}/v1/game/logo`, bodyParams);
				console.log("3");
				if (res.data.message === "success") {
					console.log(res);
					setgameInfo({});
					setFileName();
					setFileSize();
					setUploadGameLoading(false);
					setSuccess(true);
					setTimeout(() => {
						handleClose();
					}, 4000);
				} else {
					setUploadGameLoading(false);
					setFailed(true);
				}
			} catch (err) {
				setUploadGameLoading(false);
				setFailed(true);
				console.log(err.response);
			}
		} else {
			setUploadGameLoading(false);
		}
	};

	const skeletonArray = Array.from(Array(8).keys());

	let componentGameList;
	let componentModal;
	let componentButtonCreate;
	let componentErrorName;
	let componentErrorSymbol;
	let componentErrorImage;

	if (loadingGameList) {
		componentGameList = (
			<>
				{skeletonArray.map((item, idx) => (
					<Grid item md={4} sm={6} xs={12} key={idx}>
						<SkeletonTheme baseColor="#3D1C6C" highlightColor="#402A7D" duration={2}>
							<Skeleton className={cx("skeleton")} />
						</SkeletonTheme>
					</Grid>
				))}
			</>
		);
	} else {
		componentGameList = gameList.map((item, idx) => (
			<Grid item md={4} sm={6} xs={12} key={idx}>
				<Item item={item} />
			</Grid>
		));
	}

	if (!uploadImageLoading && !uploadGameLoading) {
		componentButtonCreate = (
			<Button className={cx("modal_create")} onClick={handleCreate}>
				Create now
			</Button>
		);
	} else {
		componentButtonCreate = (
			<Button className={cx("modal_create")}>
				<CircularProgress />
			</Button>
		);
	}

	if (errorName) {
		componentErrorName = (
			<div className={cx("error_tag")}>
				<p className={cx("error_tag_text")}>Name should not be empty!</p>
			</div>
		);
	}

	if (errorSymbol) {
		componentErrorSymbol = (
			<div className={cx("error_tag")}>
				<p className={cx("error_tag_text")}>Symbol should not be empty!</p>
			</div>
		);
	}

	if (errorImage) {
		componentErrorImage = (
			<div className={cx("error_tag")}>
				<p className={cx("error_tag_text")}>Image should not be empty or larger than 5MB!</p>
			</div>
		);
	}

	if (uploadGameLoading) {
		componentModal = (
			<div className={cx("modal_success")}>
				<img src={logoLoading} alt="logo" className={cx("loading_logo")} />
				<p className={cx("modal_text")}>LOADING</p>
			</div>
		);
	} else {
		if (success) {
			componentModal = (
				<div className={cx("modal_success")}>
					<img src={logoSuccess} alt="logo" className={cx("success_logo")} />
					<p className={cx("modal_text")}>SUCCESSFUL</p>
				</div>
			);
		} else if (failed) {
			componentModal = (
				<div className={cx("modal_failed")}>
					<img src={logoFailed} alt="logo" className={cx("success_logo")} />
					<p className={cx("modal_text")}>TRANSACTION FAILED</p>
				</div>
			);
			setTimeout(() => {
				handleClose();
			}, 4000);
		} else {
			componentModal = (
				<>
					<Typography className={cx("modal_header")}>CREATE GAME</Typography>
					<input
						placeholder="Name"
						className={errorName ? cx("input_error") : cx("input")}
						required
						value={gameInfo.name || ""}
						onChange={handleChangeName}
					/>
					{componentErrorName}
					<input
						placeholder="Game symbol"
						className={errorSymbol ? cx("input_error") : cx("input")}
						required
						value={gameInfo.symbol || ""}
						onChange={handleChangeSymbol}
					/>
					{componentErrorSymbol}
					<div className={cx("input_container", "input_container--image")}>
						{fileName ? <img src={fileUrl} alt="upload-img" className={cx("upload_img")} /> : <></>}

						<input
							placeholder={fileUrl ? "" : "Avatar"}
							// value={fileName || ""}
							className={errorImage ? cx("input_error") : cx("input_image")}
							readOnly
						/>
						<label htmlFor="file-input">
							<img src={addImage} alt="upload-img" className={cx("input_img")} />
						</label>
						<input
							placeholder="String"
							id="file-input"
							type="file"
							accept="image/*"
							style={{ display: "none" }}
							onChange={e => handleUploadImage(e)}
						/>

						{componentErrorImage}
					</div>
					<div className={cx("input_container", "input_container--image")}>
						{/* {gameInfo.avatar && <img src={gameInfo.avatar || ""} alt="preview" className={cx("preview-img")} />} */}
					</div>
					{componentButtonCreate}
				</>
			);
		}
	}

	return (
		<div className={cx("container")}>
			<div className={cx("content")}>
				<Grid container spacing={4} className={cx("grid-parent")}>
					<Grid item md={4} sm={6} xs={12}>
						<Card className={cx("create-card", "card")} onClick={handleOpen}>
							<CardContent>
								<Typography className={cx("create-header")}>
									<img src={logoCreate} alt="logo" className={cx("create-logo")} />
								</Typography>

								<Typography className={cx("create-paragraph")}>CREATE GAME</Typography>
							</CardContent>
						</Card>
					</Grid>

					{componentGameList}
				</Grid>
				<div className={cx("pagination")}>
					{/* <Pagination
						pageSize={PAGE_SIZE}
						showSizeChanger={false}
						// current={currentPage}
						// total={totalGame}
						// onChange={page => setCurrentPage(page)}
						// itemRender={itemRender}
					/> */}
				</div>
				<Modal open={open} onClose={handleClose}>
					<div className={cx("modal-style")}>{componentModal}</div>
				</Modal>
			</div>
		</div>
	);
};

export default CreateGame;
