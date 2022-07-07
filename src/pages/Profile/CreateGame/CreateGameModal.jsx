import axios from "axios";
import cn from "classnames/bind";
import { create } from "ipfs-http-client";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import styles from "./CreateGame.module.scss";
import { URL } from "src/constants/constants";
import { useWeb3React } from "@web3-react/core";
import addImage from "src/assets/images/add.png";
import Typography from "@mui/material/Typography";
import { BSC_CHAIN_ID } from "src/constants/network";
import { FACTORY_ADDRESS } from "src/constants/address";
import FACTORY_ABI from "src/utils/abi/KawaiiFactory.json";
import CircularProgress from "@mui/material/CircularProgress";
import { read, createNetworkOrSwitch, write } from "src/lib/web3";
import Spin from "src/components/common/Spin";

const cx = cn.bind(styles);
const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateGameModal = ({ logInfo, setHash, setLoadingTitle, setStepLoading, setUploadGameLoading, handleClose }) => {
	const [uploadImageLoading, setUploadImageLoading] = useState(false);
	const [errorSymbol, setErrorSymbol] = useState(false);
	const { account, chainId, library } = useWeb3React();
	const [errorImage, setErrorImage] = useState(false);
	const [errorName, setErrorName] = useState(false);
	const [gameInfo, setgameInfo] = useState({});
	const [fileSize, setFileSize] = useState();
	const [fileUrl, setFileUrl] = useState();

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

		const imageSize = Math.ceil(e.target.files[0].size / 1024);
		const file = e.target.files[0];
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
				setStepLoading(0);
				await write(
					"createNFT1155",
					library.provider,
					FACTORY_ADDRESS,
					FACTORY_ABI,
					[account, gameInfo.name, gameInfo.symbol, Date.now()],
					{ from: account },
					hash => {
						console.log(hash);
						setHash(hash);
						setStepLoading(1);
					}
				);
				setStepLoading(null);
				setLoadingTitle("Sign in your wallet!");

				const totalGame = await read("nftOfUserLength", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account]);
				let gameAddress = await read("nftOfUser", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account, totalGame - 1]);
				const signature = await getSignature(gameAddress, gameInfo.avatar);

				let bodyParams = {
					contract: gameAddress,
					logoUrl: gameInfo.avatar,
					sign: signature,
				};

				const res = await axios.post(`${URL}/v1/game/logo`, bodyParams);

				if (res.data.message === "success") {
					console.log(res);
					setStepLoading(2);
					setgameInfo({});
					setFileSize();
					logInfo();
					setTimeout(() => {
						handleClose();
						setUploadGameLoading(false);
					}, 4000);
				} else {
					setStepLoading(4);
				}
			} catch (err) {
				setStepLoading(4);
				console.log(err.response);
				setTimeout(() => {
					handleClose();
					setUploadGameLoading(false);
				}, 4000);
			}
		} else {
			setUploadGameLoading(false);
		}
	};

	let componentButtonCreate;
	let componentErrorName;
	let componentErrorSymbol;
	let componentErrorImage;

	if (gameInfo.name !== undefined && gameInfo.symbol !== undefined && gameInfo.avatar !== undefined) {
		componentButtonCreate = (
			<Button className={cx("modal_create")} onClick={handleCreate}>
				Create now
			</Button>
		);
	} else
		componentButtonCreate = (
			<Button className={cx("modal_pending_create")} onClick={handleCreate}>
				Create now
			</Button>
		);

	// } else {
	// 	componentButtonCreate = (
	// 		<Button className={cx("modal_create")}>
	// 			<Spin />
	// 		</Button>
	// 	);
	// }

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

	return (
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
				{!uploadImageLoading ? (
					fileUrl ? (
						<img src={fileUrl} alt="loading image" className={cx("upload_img")} />
					) : (
						<></>
					)
				) : (
					<span className={cx("upload_img_spin")}>
						<Spin />
					</span>
				)}

				<input
					placeholder={fileUrl || uploadImageLoading ? "" : "Avatar"}
					className={errorImage ? cx("input_error_image") : cx("input_image")}
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
			<div className={cx("input_container", "input_container--image")}></div>
			{componentButtonCreate}
		</>
	);
};
export default CreateGameModal;
