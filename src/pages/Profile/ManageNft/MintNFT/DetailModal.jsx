import { Modal } from "react-bootstrap";
import React, { useState } from "react";
import styles from "./DetailModal.module.scss";
import cn from "classnames/bind";
import closeIcon from "src/assets/icons/close-icon.svg";
import Grid from "@mui/material/Grid";
import defaultImage from "src/assets/icons/default_image.svg";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const cx = cn.bind(styles);

const DetailModal = ({ openDetailModal, onHide, selectedNft }) => {
	return (
		<Modal show={openDetailModal} onHide={onHide} dialogClassName={cx("modal-box")} centered>
			<Modal.Body className={cx("modal-body")}>
				<div className={cx("modal-style")}>
					<div className={cx("close-icon")} onClick={onHide}>
					<CloseRoundedIcon />
					</div>

					<div className={cx("title")}>
						<div className={cx("big-title")}>PREVIEW NFT</div>
					</div>

					<div className={cx("main-content")}>
						<div className={cx("left")}>
							<div className={cx("image-box")}>
								<img src={selectedNft?.imageUrl ? selectedNft.imageUrl : defaultImage} alt="nft" />
							</div>
						</div>
						<div className={cx("right")}>
							<div className={cx("title")}>
								<div className={cx("tokenId")}>#{selectedNft?.tokenId}</div>
								<div className={cx("name")}>{selectedNft?.name || "NFT name"}</div>
								<div className={cx("text")}>Category: {selectedNft?.category}</div>
								<div className={cx("text")}>Supply: {selectedNft?.supply}</div>
								<div className={cx("text")}>
									Author: {selectedNft?.author?.slice(0, 8) + "..." + selectedNft?.author?.slice(-8)}
								</div>
							</div>
							<div className={cx("description")}>
								<div className={cx("subtitle")}>Description:</div>
								<div className={cx("content")}>{selectedNft?.description}</div>
							</div>
							<div className={cx("description")}>
								<div className={cx("subtitle")}>Attributes:</div>
								<div className={cx("content")} style={{ padding: 0 }}>
									<div className={cx("attribute-table")}>
										<Grid container className={cx("tb-header")}>
											<Grid item xs={3}>
												Image
											</Grid>
											<Grid item xs={5}>
												Name
											</Grid>
											<Grid item xs={4}>
												Value
											</Grid>
										</Grid>

										<div className={cx("divider")}></div>

										{selectedNft?.attributes?.length > 0 ? (
											<div className={cx("list-attribute")}>
												<div>
													{selectedNft?.attributes
														.filter(item => item.valueType === "Text")
														?.map((info, ind) => (
															<Grid container className={cx("tb-row")} key={ind}>
																<Grid item xs={3}>
																	<img
																		src={info?.image ? info?.image : defaultImage}
																		alt="attr"
																		className={cx("attr-image")}
																	/>
																</Grid>
																<Grid item xs={5}>
																	{info?.type}
																</Grid>
																<Grid item xs={4}>
																	{info?.value}
																</Grid>
															</Grid>
														))}
												</div>
												<div>
													{selectedNft?.attributes
														.filter(item => item.valueType === "Image")
														?.map((info, ind) => (
															<Grid container className={cx("tb-row")} key={ind}>
																<Grid item xs={3}>
																	<img
																		src={info?.image ? info?.image : defaultImage}
																		alt="attr"
																		className={cx("attr-image")}
																	/>
																</Grid>
																<Grid item xs={5}>
																	{info?.type}
																</Grid>
																<Grid item xs={4}>
																	<img
																		src={info?.value ? info?.value : defaultImage}
																		alt="attr"
																		className={cx("attr-image")}
																	/>
																</Grid>
															</Grid>
														))}
												</div>
											</div>
										) : (
											<div>No attributes</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default DetailModal;
