import { Box } from "@mui/system";
import NFTCard from "src/components/common/NFTCard";
import { Grid, Pagination } from "@mui/material";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cx = cn.bind(styles);

const pageSize = 10;
const mockData = [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

export default function List({ listNft, gameSelected }) {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);

	return (
		<>
			<Box display="flex" justifyContent="center" flexWrap="wrap">
				<Grid container spacing={2}>
					{listNft?.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((nft, index) => (
						<Grid item onClick={() => navigate(`/view-nft/${gameSelected || nft.contract}/${nft.tokenId}`)}>
							<NFTCard nftInfo={nft} hasPrice={false} />
						</Grid>
					))}
				</Grid>
			</Box>
			{listNft.length / pageSize > 1 && (
				<div style={{ width: "100%" }}>
					<Pagination
						count={Math.round(mockData.length / pageSize)}
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
