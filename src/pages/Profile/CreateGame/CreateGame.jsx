import Item from "./Item";
import axios from "axios";
import cn from "classnames/bind";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import { create } from "ipfs-http-client";
import { useEffect, useState } from "react";
import styles from "./CreateGame.module.scss";
import { URL } from "src/constants/constants";
import Skeleton from "@mui/material/Skeleton";
import { useWeb3React } from "@web3-react/core";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import logoCreate from "src/assets/icons/plus1.png";
import { BSC_CHAIN_ID } from "src/constants/network";
import { FACTORY_ADDRESS } from "src/constants/address";
import CreateGameModal from "./CreateGameModal";
import Pagination from "src/components/common/Pagination";
import FACTORY_ABI from "src/utils/abi/KawaiiFactory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { read } from "src/lib/web3";
import LoadingModal from "src/components/common/LoadingModal2/LoadingModal";

const cx = cn.bind(styles);
const client = create("https://ipfs.infura.io:5001/api/v0");
const PAGE_SIZE = 8;

const CreateGame = () => {
	const [uploadGameLoading, setUploadGameLoading] = useState(false);
	const [loadingGameList, setLoadingGameList] = useState(false);
	const { account, chainId, library } = useWeb3React();
	const [loadingTitle, setLoadingTitle] = useState("");
	const [stepLoading, setStepLoading] = useState(0);
	const [totalPage, setTotalPage] = useState(1);
	const [gameList, setGameList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [hash, setHash] = useState();

	useEffect(() => {
		logInfo();
	}, [account, page]);

	const logInfo = async type => {
		if (!account) return;
		setGameList([]);
		setLoadingGameList(true);
		try {
			let lists = [];
			const totalGame = await read("nftOfUserLength", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account]);
			let fromIndex;
			let toIndex;
			setTotalPage(Math.ceil(totalGame / PAGE_SIZE));
			if (page == 1) {
				fromIndex = totalGame - 1;
			} else {
				fromIndex = totalGame - PAGE_SIZE * (page - 1) - 1;
			}

			if (fromIndex < PAGE_SIZE - 1) toIndex = 0;
			else toIndex = fromIndex - PAGE_SIZE + 1;

			const listPromise = Array(PAGE_SIZE)
				.fill()
				.map((_, idx) =>
					read("nftOfUser", BSC_CHAIN_ID, FACTORY_ADDRESS, FACTORY_ABI, [account, toIndex + PAGE_SIZE - idx - 1])
				);
			const listGame = await Promise.all(listPromise);
			const listName = await Promise.all(listGame.map(address => read("name", BSC_CHAIN_ID, address, NFT1155_ABI, [])));
			const listUrl = await Promise.all(
				listGame.map(async address => {
					const res = await axios.get(`${URL}/v1/game/logo?contract=${address}`);
					let gameUrl = "";
					if (res.data.data[0]) {
						gameUrl = res.data.data[0].logoUrl;
					}
					return gameUrl;
				})
			);
			lists = listGame.map((address, idx) => ({
				gameAddress: address,
				gameName: listName[idx],
				gameUrl: listUrl[idx],
			}));

			setGameList(lists);
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
	};

	const handleChange = (event, pageNumber) => {
		setPage(pageNumber);
	};

	const skeletonArray = Array.from(Array(8).keys());

	let componentGameList;

	if (loadingGameList) {
		componentGameList = (
			<>
				{skeletonArray.map((item, idx) => (
					<Grid item md={4} sm={6} xs={12} key={idx}>
						<Skeleton
							sx={{ bgcolor: "#ffddb9", borderRadius: "6px" }}
							variant="rectangular"
							animation="wave"
							width="100%"
							height="163px"
						/>
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
					<Pagination count={totalPage} page={page} onChange={handleChange} />
				</div>
				{uploadGameLoading && (
					<LoadingModal
						show={uploadGameLoading}
						network={"KawaiiScan"}
						loading={loading}
						title={loadingTitle}
						stepLoading={stepLoading}
						onHide={() => {
							setUploadGameLoading(false);
							setHash(undefined);
							setStepLoading(0);
						}}
						hash={hash}
						hideParent={() => {}}
						notViewNft={true}
					/>
				)}
				<Modal open={open} onClose={handleClose}>
					<div className={cx("modal-style")}>
						<CreateGameModal
							setLoadingTitle={setLoadingTitle}
							setStepLoading={setStepLoading}
							setUploadGameLoading={setUploadGameLoading}
							handleClose={handleClose}
							setHash={setHash}
							logInfo={logInfo}
						/>
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default CreateGame;
