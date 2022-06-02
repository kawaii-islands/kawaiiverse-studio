import React, { useEffect, useState } from "react";
import styles from "./MintNFTBox.module.scss";
import cn from "classnames/bind";
import { Menu, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import subtractIcon from "src/assets/icons/subtract.svg";
import uploadImageIcon from "src/assets/icons/uploadImage.svg";
import plusCircleIcon from "src/assets/icons/plus_circle.svg";
import TableAddAttribute from "./TableAddAttribute";
import inforIcon from "src/assets/icons/InforIcon.svg";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { create } from "ipfs-http-client";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import axios from "axios";
import { URL } from "src/constants/constant";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const cx = cn.bind(styles);

let oneAttribute = {
	type: "",
	value: "",
	image: "",
	valueType: "Text",
};

const oneAttributeError = {
	nameDuplicate: false,
	nameNull: false,
	valueNull: false,
	disable: false,
};

const client = create("https://ipfs.infura.io:5001/api/v0");

const MintNFTBox = ({
	setOpenMintNFTBox,
	setStateForNftData,
	data,
	listNft,
	setListNft,
	openMintNFTBox,
	gameSelected,
}) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [listAttribute, setListAttribute] = useState([data.attributes]);
	const [listCategory, setListCategory] = useState([]);
	const [showListCategory, setShowListCategory] = useState(false);
	const [listCategoryDisplay, setListCategoryDisplay] = useState();
	const [listAttributeError, setListAttributeError] = useState([]);
	const [listRarity, setListRarity] = useState([]);
	const [listRarityDisplay, setListRarityDisplay] = useState([]);

	useEffect(() => {
		setListAttribute(data.attributes);
		getListCategory();
		getListRarity();

		let tmpArray = Array(listAttribute.length).fill(oneAttributeError);
		setListAttributeError(tmpArray);

		setTimeout(() => {
			setLoading(false);
		}, 1500);
	}, []);

	useEffect(() => {
		setStateForNftData("attributes", listAttribute);
	}, [listAttribute]);

	const getListNftByContract = async () => {
		try {
			const res = await axios.get(`${URL}/v1/nft/${gameSelected.toLowerCase()}`);
			if (res.status === 200) {
				return res.data.data;
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getListCategory = async () => {
		let cate = [];
		listNft.map((item, id) => {
			if (item.category) {
				cate = [...cate, item.category];
			}
		});

		let listCategory = [];
		let uniqueCategory = [];

		try {
			const res = await axios.get(`${URL}/v1/nft/${gameSelected.toLowerCase()}`);
			if (res.status === 200) {
				res.data.data.map((item, index) => {
					if (item.category) {
						listCategory = [...listCategory, item.category];
					}
				});
			}
		} catch (err) {
			console.log(err);
		}

		listCategory = [...listCategory, ...cate];
		uniqueCategory = [...new Set(listCategory)];
		setListCategory(uniqueCategory);
		setListCategoryDisplay(uniqueCategory);
	};

	const setDetailAttribute = (key, value, index) => {
		let listAttributeCopy = [...listAttribute];
		listAttributeCopy[index] = { ...listAttributeCopy[index], [key]: value };

		setListAttribute(listAttributeCopy);
	};

	const setAttributeError = (key, value, index) => {
		let listAttributeErrorCopy = [...listAttributeError];
		listAttributeErrorCopy[index] = { ...listAttributeErrorCopy[index], [key]: value };

		setListAttributeError(listAttributeErrorCopy);
	};

	const handleSelectCategory = value => {
		let result = [...listCategory];
		if (value) {
			result = listCategory.filter(item => item.toLowerCase().includes(value.toLowerCase()));
		}
		setListCategoryDisplay(result);
	};

	const getListRarity = async () => {
		let rarity = [];
		listNft.map((item, id) => {
			if (item.rarity) {
				rarity = [...rarity, item.rarity];
			}
		});

		let listRarity = [];
		let uniqueRarity = [];

		try {
			const res = await axios.get(`${URL}/v1/nft/${gameSelected.toLowerCase()}`);
			if (res.status === 200) {
				res.data.data.map((item, index) => {
					if (item.rarity) {
						listRarity = [...listRarity, item.rarity];
					}
				});
			}
		} catch (err) {
			console.log(err);
		}

		listRarity = [...listRarity, ...rarity];
		uniqueRarity = [...new Set(listRarity)];
		setListRarity(uniqueRarity);
		setListRarityDisplay(uniqueRarity);
	};

	const handleSelectRarity = value => {
		let result = [...listRarity];
		if (value) {
			result = listRarity.filter(item => item.toLowerCase().includes(value.toLowerCase()));
		}
		setListRarityDisplay(result);
	};

	const menuRarity = (
		<Menu className={cx("menu-dropdown")}>
			{listRarityDisplay?.map((rarity, idx) => (
				<Menu.Item key={idx} onClick={() => setStateForNftData("rarity", rarity)}>
					<div>{rarity}</div>
				</Menu.Item>
			))}
		</Menu>
	);

	const menuCategory = (
		<Menu className={cx("menu-dropdown")}>
			{listCategoryDisplay?.map((category, idx) => (
				<Menu.Item key={idx} onClick={() => setStateForNftData("category", category)}>
					<div>{category}</div>
				</Menu.Item>
			))}
		</Menu>
	);

	return (
		<div className={cx("mintNFT-box")}>
			<div className={cx("main-box")}>
				<Grid container className={cx("one-field")}>
					<Grid item xs={2} className={cx("title")}>
						Category:
					</Grid>
					<Grid item xs={10}>
						{/* <Autocomplete
							className={cx("drop-down")}
							disablePortal
							id="combo-box-demo"
							size="small"
							options={listCategoryDisplay}
							renderInput={params => <TextField {...params} label="Category" />}
						/> */}
						<Dropdown overlay={menuCategory} className={cx("drop-down")} trigger={["click"]}>
							<div className={cx("drop-down-label")}>
								<input
									value={data.category}
									placeholder="Enter category"
									className={cx("input")}
									onChange={e => {
										setStateForNftData("category", e.target.value);
										handleSelectCategory(e.target.value);
									}}
								/>
							</div>
						</Dropdown>
					</Grid>
				</Grid>

				<Grid container className={cx("one-field")}>
					<Grid item xs={2} className={cx("title")}>
						Rarity:
					</Grid>
					<Grid item xs={10}>
						<Dropdown overlay={menuRarity} className={cx("drop-down")} trigger={["click"]}>
							<div className={cx("drop-down-label")}>
								<input
									value={data.rarity}
									placeholder="Enter rarity"
									className={cx("input")}
									onChange={e => {
										setStateForNftData("rarity", e.target.value);
										handleSelectRarity(e.target.value);
									}}
								/>
							</div>
						</Dropdown>
					</Grid>
				</Grid>

				<Grid container className={cx("one-field")}>
					<Grid item xs={2} className={cx("title")}>
						Description:
					</Grid>
					<Grid item xs={10}>
						<input
							value={data.description}
							placeholder="Enter description"
							className={cx("input")}
							onChange={e => setStateForNftData("description", e.target.value)}
						/>
					</Grid>
				</Grid>

				<Grid container className={cx("one-field")} style={{ alignItems: "flex-start" }}>
					<Grid item xs={2} className={cx("title")}>
						Attributes:
					</Grid>
					<Grid item xs={10} className={cx("table-attribute")}>
						<div className={cx("table")}>
							<TableAddAttribute
								listAttribute={listAttribute}
								setListAttribute={setListAttribute}
								setDetailAttribute={setDetailAttribute}
								setStateForNftData={setStateForNftData}
								listAttributeError={listAttributeError}
								setAttributeError={setAttributeError}
								setListAttributeError={setListAttributeError}
								gameSelected={gameSelected}
								listNft={listNft}
								setListNft={setListNft}
							/>
						</div>
						<div
							className={cx("add-attribute")}
							onClick={() => {
								setListAttribute([...listAttribute, oneAttribute]);
								setListAttributeError([...listAttributeError, oneAttributeError]);
							}}>
							<AddRoundedIcon className={cx("add-icon")} />
							Add attribute
						</div>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default MintNFTBox;
