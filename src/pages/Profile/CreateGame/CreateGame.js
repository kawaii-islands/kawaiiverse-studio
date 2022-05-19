import styles from "./CreateGame.module.scss";
import Grid from "@mui/material/Grid";
import cn from "classnames/bind";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Item from "./Item";
import logoCreate from "src/assets/icons/plus1.png";

const cx = cn.bind(styles);
const PAGE_SIZE = 8;
const CreateGame = () => {
	let componentGameList;

	componentGameList = (
		<Grid item md={4} sm={6} xs={12}>
			<Item />
		</Grid>
	);

	return (
		<div className={cx("container")}>
			<div className={cx("content")}>
				<Grid container spacing={4} className={cx("grid-parent")}>
					<Grid item md={4} sm={6} xs={12}>
						<Card className={cx("create-card", "card")}>
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
				{/* <Modal open={open} onClose={handleClose}>
					<div className={cx("modal-style")}>{componentModal}</div>
				</Modal> */}
			</div>
		</div>
	);
};

export default CreateGame;
