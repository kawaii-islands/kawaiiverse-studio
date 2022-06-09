// import { Modal } from "@mui/material";
import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import styles from "./ListModal.module.scss";
import cn from "classnames/bind";
import closeIcon from "src/assets/icons/close-icon.svg";
import { InputAdornment, Input, Button, Typography, Pagination } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import checkIcon from "src/assets/icons/success.png";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import noData from "src/assets/icons/noData.png";

const cx = cn.bind(styles);
const pageSize = 4;

const ListModal = ({ open, onHide, listNft, title, desc, selectNft }) => {
	const [currentPage, setCurrentPage] = useState(1);
	// const [openDetailModal, setOpenDetailModal] = useState(false);
	// const [selectedNft, setSelectedNft] = useState();
	const [listSelected, setListSelected] = useState([]);
	const [search, setSearch] = useState("");
	const [listSearch, setListSearch] = useState([]);
	const itemRender = (current, type, originalElement) => {
		if (type === "prev") {
			return <span style={{ color: "#402A7D" }}>Prev</span>;
		}
		if (type === "next") {
			return <span style={{ color: "#402A7D" }}>Next</span>;
		}
		return originalElement;
	};

	const handleSearch = e => {
		setSearch(e.target.value);
		let listSearch = listNft.filter(nft => {
			if (nft.name) {
				return (
					nft?.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
					nft?.tokenId.toString().includes(e.target.value)
				);
			}
			return false;
		});
		if (e.target.value === "") {
			setListSearch([]);
			return;
		}
		setListSearch([...listSearch]);
	};
	const clickNft = nft => {
		const { tokenId } = nft;
		let list = [...listSelected];
		let isExist = listSelected.find(nft => nft.tokenId === tokenId);
		if (!isExist) {
			list.push(nft);
		} else {
			list = list.filter(nft => nft.tokenId !== tokenId);
		}

		setListSelected(list);
	};
	const clickOk = () => {
		selectNft(listSelected);
		setListSelected([]);
	};

	const displayList1 = listSearch.length || search ? listSearch : listNft;
	const displayList = [...displayList1].reverse();

	return (
		<Modal show={open} onHide={onHide} backdrop="static" centered className={cx("modal")}>
			<Modal.Body className={cx("modal-style")}>
				<div>
					<div className={cx("close-icon")} onClick={onHide}>
						<CloseRoundedIcon />
					</div>

					<div className={cx("header")}>
						<Input
							disableUnderline
							placeholder="Search for NFT"
							value={search}
							onChange={handleSearch}
							className={cx("search")}
							endAdornment={
								<InputAdornment position="end">
									<SearchRoundedIcon className={cx("search-icon")} />
								</InputAdornment>
							}
						/>

						<div className={cx("title")}>
							<div className={cx("big-title")}>
								{title} : {listSelected.length}
							</div>
							<div className={cx("sub-title")}>{desc}</div>

							<div className={cx("btn-confirm")}>
								<Button onClick={clickOk}>Confirm</Button>
							</div>
						</div>
					</div>

					<div className={cx("list-nft")}>
						{displayList?.length > 0 ? (
							displayList.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => {
								const isExist = listSelected.find(nft => nft.tokenId === item.tokenId);
								return (
									<div
										className={cx("nft-item", "card", isExist && "nft-item-active")}
										key={index}
										onClick={() => {
											// selectNft(item);
											clickNft(item);
										}}>
										<div className={cx(isExist ? "check" : "no-check")}>
											<img src={checkIcon} />
										</div>
										<Typography variant="body2" className={cx("id")}>
											{item?.tokenId}
										</Typography>
										<div className={cx("avatar")}>
											<img src={item?.imageUrl} />
											<Typography variant="body1" className={cx("balance")}>
												{item?.supply}
											</Typography>
										</div>
										<Typography variant="body1" className={cx("name")}>
											{item?.name}
										</Typography>
									</div>
								);
							})
						) : (
							<div style={{ margin: "0 auto" }}>
								<img src={noData} alt="no-data" />
							</div>
						)}
					</div>

					{displayList.length / pageSize > 1 && (
						<div className={cx("pagination")}>
							<Pagination
								count={Math.ceil(displayList.length / pageSize)}
								shape="rounded"
								onChange={(e, page) => setCurrentPage(page)}
							/>
						</div>
					)}
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default ListModal;
