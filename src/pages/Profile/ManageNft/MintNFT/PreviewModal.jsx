import { Modal } from "react-bootstrap";
import React, { useState } from "react";
import styles from "./PreviewModal.module.scss";
import cn from "classnames/bind";
import closeIcon from "src/assets/icons/close-icon.svg";
import DetailModal from "./DetailModal";
import defaultImage from "src/assets/icons/default_image.svg";
import NFTCard from "src/components/common/NFTCard";
import { Pagination } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const cx = cn.bind(styles);

const pageSize = 8;

const PreviewModal = ({ open, onHide, listNft }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [openDetailModal, setOpenDetailModal] = useState(false);
	const [selectedNft, setSelectedNft] = useState();

	const itemRender = (current, type, originalElement) => {
		if (type === "prev") {
			return <span style={{ color: "#402A7D" }}>Prev</span>;
		}
		if (type === "next") {
			return <span style={{ color: "#402A7D" }}>Next</span>;
		}
		return originalElement;
	};

	return (
		<Modal show={open} onHide={onHide} dialogClassName={cx("modal-box")} centered>
			<Modal.Body className={cx("modal-body")}>
				<div className={cx("modal-style")}>
					<div className={cx("close-icon")} onClick={onHide}>
						<CloseRoundedIcon />
					</div>

					<div className={cx("title")}>
						<div className={cx("big-title")}>PREVIEW NFT</div>
						<div className={cx("sub-title")}>You can click on each nft to see details</div>
					</div>

					<div className={cx("list-nft")}>
						{listNft.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => (
							<div
								key={index}
								onClick={() => {
									setSelectedNft(item);
									setOpenDetailModal(true);
								}}
								className={cx("nft-card")}>
								<NFTCard nftInfo={item} hasPrice={false} />
							</div>
						))}
					</div>
					<div className={cx("pagination")}>
						{listNft.length > pageSize && (
							<Pagination
								count={Math.ceil(listNft.length / pageSize)}
								shape="rounded"
								onChange={(e, page) => setCurrentPage(page)}
							/>
						)}
					</div>

					<DetailModal
						openDetailModal={openDetailModal}
						onHide={() => setOpenDetailModal(false)}
						selectedNft={selectedNft}
					/>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default PreviewModal;
