import React, { useEffect, useState } from "react";
import styles from "../../ManageNft/ViewNFT/ViewNFT.module.scss";
import cn from "classnames/bind";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import List from "src/components/Marketplace/List";
import { Row, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "src/constants/constant";
import { Search as SearchIcon } from "@material-ui/icons";
import { toast } from "react-toastify";
import noData from "src/assets/icons/noData.png";
import { Input, OutlinedInput, InputAdornment, MenuItem, FormControl, Select, Button } from "@mui/material";

const cx = cn.bind(styles);

const names = ["Price: Low to High", "Price: High to Low"];

const ViewNFT = ({ gameSelected, setIsMintNFT }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [listNftByContract, setListNftByContract] = useState();
	const [listNft, setListNft] = useState();
	const [search, setSearch] = useState("");
	const [sort1, setSort] = useState(names[1]);
	const [originalList, setOriginalList] = useState([]);
	const [listSearch, setListSearch] = useState([]);

	useEffect(() => {
		getListNftByContract();
	}, [gameSelected]);

	const getListNftByContract = async () => {
		setLoading(true);

		try {
			const res = await axios.get(`${URL}/v1/nft/${gameSelected.toLowerCase()}`);
			if (res.status === 200) {
				let data = res.data.data.reverse();
				setListNftByContract(data);
				setListNft(data);
				setOriginalList(data);
				setLoading(false);
			}
		} catch (err) {
			toast.error(err);
			console.log(err);
		}
	};

	const handleSearch = e => {
		let arr = [...listNftByContract];
		let result = arr.filter((nft, idx) => {
			let condition1 = nft?.tokenId.toString().includes(e.target.value);
			let condition2 = nft?.name.toUpperCase().includes(e.target.value.toUpperCase());
			let condition3 = nft?.author.toUpperCase().includes(e.target.value.toUpperCase());
			return condition1 || condition2 || condition3;
		});
		setListNft([...result]);
	};
	const handleSort = sort => {
		if (sort === sort1) {
			setSort("");
			setListNft(originalList);
			if (search !== "") {
				let listSearch = listNft.filter(nft => {
					if (nft.name) {
						return nft?.name.toUpperCase().includes(search.toUpperCase()) || nft?.tokenId.toString().includes(search);
					}
					return false;
				});
				setListSearch([...listSearch]);
			}
			return;
		}
		setSort(sort);
		let newList = search !== "" ? [...listSearch] : [...listNft];

		if (sort === "low") {
			newList = newList.sort(function (a, b) {
				return Number(a.price) - Number(b.price);
			});
		}
		if (sort === "high") {
			newList = newList.sort(function (a, b) {
				return Number(b.price) - Number(a.price);
			});
		}
		if (search !== "") {
			setListSearch(newList);
			return;
		}
		setListNft(newList);
	};

	return (
		<div className={cx("view-nft")}>
			<div className={cx("top")}>
				<div className={cx("left-title")}>
					<div className={cx("title")}>{listNft?.length} Items</div>
					<Input
						disableUnderline
						placeholder="Search for NFT"
						className={cx("search")}
						endAdornment={
							<InputAdornment position="end">
								<SearchIcon className={cx("icon")} />
							</InputAdornment>
						}
						onChange={e => handleSearch(e)}
					/>
				</div>

				<div className={cx("group-search")}>
					<FormControl>
						<Select
							className={cx("sort")}
							displayEmpty
							input={<OutlinedInput />}
							value={sort1}
							onChange={e => setSort(e.target.value)}
							size="small">
							{names.map(name => (
								<MenuItem key={name} value={name} className={cx("item")}>
									{name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Button
						className={cx("button")}
						onClick={() => {
							navigate({ search: "?view=false" });
							setIsMintNFT(true);
						}}>
						Mint NFT
					</Button>
				</div>
			</div>

			<Row>
				{loading ? (
					<ListSkeleton />
				) : listNft.length > 0 ? (
					<div className={cx("list-nft")}>
						<List listNft={listNft} gameSelected={gameSelected} hasPrice={false} />
					</div>
				) : (
					<div style={{ margin: "0 auto" }}>
						<img src={noData} alt="no-data" />
					</div>
				)}
			</Row>
		</div>
	);
};

export default ViewNFT;
