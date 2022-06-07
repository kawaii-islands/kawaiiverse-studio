import { Box } from "@mui/system";
import NFTCard from "src/components/common/NFTCard";
import { Grid } from "@mui/material";
import Pagination from "src/components/common/Pagination";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cx = cn.bind(styles);

const pageSize = 12;

export default function List({ listNft, gameSelected, hasPrice, canBuy }) {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	console.log('listNft :>> ', listNft);

	return (
		<>
			<Box display="flex" justifyContent="center" flexWrap="wrap" style={{ marginBottom: "30px" }}>
				<Grid container spacing={2}>
					{listNft?.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((nft, index) => (
						<Grid
							key={index}
							item
							onClick={() => {
								if (hasPrice && canBuy) {
									navigate(`/view-nft/${nft.contract}/${nft.tokenId}/${nft.index}?hasPrice=true&canBuy=true`);
								} else if (hasPrice) {
									navigate(`/view-nft/${gameSelected}/${nft.tokenId}/${nft.index}?hasPrice=true&canBuy=false`);
								} else {
									navigate(`/view-nft/${gameSelected}/${nft.tokenId}?hasPrice=true&canBuy=false`);
								}
							}}>
							<NFTCard nftInfo={nft} hasPrice={hasPrice} canBuy={canBuy} />
						</Grid>
					))}
				</Grid>
			</Box>

			<div style={{ width: "100%" }}>
				<Pagination
					count={Math.ceil(listNft.length / pageSize)}
					color="primary"
					shape="rounded"
					onChange={(e, page) => setCurrentPage(page)}
				/>
			</div>
		</>
	);
}
