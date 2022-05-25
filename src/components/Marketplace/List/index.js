import { Box } from "@mui/system";
import NFTCard from "src/components/common/NFTCard";
import { Grid, Pagination } from "@mui/material";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cx = cn.bind(styles);

const pageSize = 12;

export default function List({ listNft, gameSelected, hasPrice }) {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);

	return (
		<>
			<Box display="flex" justifyContent="center" flexWrap="wrap">
				<Grid container spacing={2}>
					{listNft?.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((nft, index) => (
						<Grid key={index} item onClick={() => navigate(`/view-nft/${gameSelected || nft.contract}/${nft.tokenId}`)}>
							<NFTCard nftInfo={nft} hasPrice={hasPrice} />
						</Grid>
					))}
				</Grid>
			</Box>
			{listNft.length / pageSize > 1 && (
				<div style={{ width: "100%" }}>
					<Pagination
						count={Math.ceil(listNft.length / pageSize)}
						color="primary"
						shape="rounded"
						className={cx("pagination")}
						onChange={(e, page) => setCurrentPage(page)}
					/>
				</div>
			)}
		</>
	);
}
