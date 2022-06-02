import { OutlinedInput, Modal, Typography, Button } from "@mui/material";
import cn from "classnames/bind";
import styles from "./BuyModal.module.scss";
import cartIcon from "src/assets/icons/cart.svg";
import { Close } from "@mui/icons-material";
import tokenIcon from "src/assets/icons/kwt.png";
import { Box } from "@mui/system";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import formatNumber from "src/utils/formatNumber";
import Web3 from "web3";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/constants/blockchain";
import { read, write, createNetworkOrSwitch } from "src/services/web3";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import { KAWAIIVERSE_STORE_ADDRESS, KAWAII_TOKEN_ADDRESS, RELAY_ADDRESS } from "src/constants/address";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import KAWAII_TOKEN_ABI from "src/utils/abi/KawaiiToken.json";
import LoadingModal from "../LoadingModal2/LoadingModal";

const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

export default function BuyModal({ show, setShow, info }) {
	const { account, library, chainId } = useWeb3React();
	const { kwtPrice } = useSelector(state => state?.price);
	const [amount, setAmount] = useState(1);
	const [showModalLoading, setShowModalLoading] = useState(false);
	const [loadingTitle, setLoadingTitle] = useState("");
	const [stepLoading, setStepLoading] = useState(0);
	const [hash, setHash] = useState();
	const [loadingModal, setLoadingModal] = useState(false);
	const { nftId, address, index } = useParams();

	const getAllowance = async () => {
		if (!account) return;
		const allowance = await read("allowance", BSC_CHAIN_ID, KAWAII_TOKEN_ADDRESS, KAWAII_TOKEN_ABI, [
			account,
			KAWAIIVERSE_STORE_ADDRESS,
		]);
		return allowance;
	};

	const approve = async () => {
		return await write(
			"approve",
			library.provider,
			KAWAII_TOKEN_ADDRESS,
			KAWAII_TOKEN_ABI,
			[KAWAIIVERSE_STORE_ADDRESS, Web3.utils.toWei("9999999999", "ether")],
			{ from: account }
		);
	};

	const buyNft = async () => {
		setShow(false);
		try {
			if (chainId !== BSC_CHAIN_ID) {
				const error = await createNetworkOrSwitch(library.provider);
				if (error) {
					toast.error(error);
					throw new Error("Please change network to Testnet Binance smart chain.");
				}
			}
			setShowModalLoading(true);
			setStepLoading(0);
			setLoadingModal(true);
			const allowance = await getAllowance();
			if (allowance < Number(web3.utils.fromWei(info?.price)) * parseInt(amount)) {
				await approve();
			}

			await write(
				"buyNFT1155",
				library.provider,
				KAWAIIVERSE_STORE_ADDRESS,
				KAWAII_STORE_ABI,
				[address, index, amount],
				{ from: account },
				hash => {
					console.log(hash);
					setHash(hash);
					setStepLoading(1);
				}
			);
			setStepLoading(2);
		} catch (err) {
			console.log(err);
			toast.error(err);
			setStepLoading(3);
		} finally {
			setLoadingModal(false);
		}
	};

	return (
		<>
			{showModalLoading && (
				<LoadingModal
					show={showModalLoading}
					network={"BscScan"}
					loading={loadingModal}
					title={loadingTitle}
					stepLoading={stepLoading}
					onHide={() => {
						setShowModalLoading(false);
						setHash(undefined);
						setStepLoading(0);
					}}
					hash={hash}
					hideParent={() => {}}
					notViewNft={true}
				/>
			)}
			<Modal
				open={show}
				animation="true"
				onClose={() => {
					setShow(false);
				}}>
				<div className={cx("buy-modal")}>
					<Close
						className={cx("close")}
						htmlColor="#F8A629"
						onClick={() => {
							setShow(false);
						}}
					/>
					<div className={cx("title")}>
						<img src={cartIcon} />
						<Typography variant="h6" className={cx("text")}>
							NFT #{info?.tokenId}
						</Typography>
					</div>
					<div className={cx("info")}>
						<div className={cx("avatar")}>
							<img src={info?.imageUrl} />
						</div>
						<div className={cx("right")}>
							<div className={cx("row")}>
								<Typography variant="body1" className={cx("label")}>
									Available:
								</Typography>
								<Typography variant="body1" className={cx("label", "usd")}>
									{Number(info?.amount) - Number(info?.alreadySale)}
								</Typography>
							</div>
							<div className={cx("row")}>
								<Typography variant="body1" className={cx("label")}>
									Price/NFT:
								</Typography>
								<Box display="flex">
									<img src={tokenIcon} className={cx("token")} />
									<Typography variant="body1" className={cx("label")}>
										{info?.price && formatNumber(Number(web3.utils.fromWei(info?.price.toString())))}
									</Typography>
									<Typography variant="body1" className={cx("label", "usd")}>
										${info?.price && formatNumber(Number(web3.utils.fromWei(info?.price.toString())) * kwtPrice)}
									</Typography>
								</Box>
							</div>
							<div className={cx("row")}>
								<Typography variant="body1" className={cx("label")}>
									Amount:
								</Typography>
								<OutlinedInput
									className={cx("input")}
									value={amount}
									type="number"
									inputProps={{
										min: 1,
										max: Number(info?.amount) - Number(info?.alreadySale),
									}}
									onChange={e => setAmount(e.target.value)}
								/>
							</div>
							<div className={cx("row")}>
								<Typography variant="body1" className={cx("label")}>
									Total:
								</Typography>
								<Box display="flex">
									<img src={tokenIcon} className={cx("token")} />
									<Typography variant="body1" className={cx("label")}>
										{info?.price && formatNumber(Number(web3.utils.fromWei(info?.price.toString()))) * amount}
									</Typography>
									<Typography variant="body1" className={cx("label", "usd")}>
										$
										{info?.price &&
											formatNumber(Number(web3.utils.fromWei(info?.price.toString())) * kwtPrice * amount)}
									</Typography>
								</Box>
							</div>
							<Button className={cx("button")} onClick={buyNft}>
								Buy
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
}
