import { Box } from "@mui/system";
import NFTCard from "src/components/common/NFTCard";
import { Grid, Pagination } from "@mui/material";
import styles from "./index.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

export default function List() {
	return (
		<>
			<Box display="flex" justifyContent="center" flexWrap="wrap">
				<Grid container spacing={2} justifyContent="center">
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
					<Grid item>
						<NFTCard />
					</Grid>
				</Grid>
			</Box>
			<Pagination count={10} color="primary" shape="rounded" className={cx("pagination")} />
		</>
	);
}
