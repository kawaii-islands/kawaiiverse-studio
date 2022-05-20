import React, { useEffect, useState } from "react";
import styles from "./ViewNFT.module.scss";
import cn from "classnames/bind";
import ListSkeleton from "src/components/common/ListSkeleton/ListSkeleton";
import List from "src/components/Marketplace/List";
import { Dropdown, Empty, Pagination, Row,Menu,  } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "src/constants/constant";
import { Button, Input, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@material-ui/icons";
import ListNft from "src/components/Marketplace/List";
import { toast } from "react-toastify";
import { DownOutlined } from "@ant-design/icons";
import noData from 'src/assets/icons/noData.png';

const cx = cn.bind(styles);

const pageSize = 15;

const ViewNFT = ({ gameSelected, setIsMintNFT }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [listNftByContract, setListNftByContract] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [listNft, setListNft] = useState();
    const [search, setSearch] = useState("");
    const [sort1, setSort] = useState("");
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

    const itemRender = (current, type, originalElement) => {
        if (type === "prev") {
            return <span style={{ color: "#FFFFFF" }}>Prev</span>;
        }
        if (type === "next") {
            return <span style={{ color: "#FFFFFF" }}>Next</span>;
        }
        return originalElement;
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
                        return (
                            nft?.name.toUpperCase().includes(search.toUpperCase()) ||
                            nft?.tokenId.toString().includes(search)
                        );
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
    const menu = (
        <Menu className={cx("menu-dropdown")}>
            <Menu.Item
                key="low-high"
                onClick={() => handleSort("low")}
                className={cx(sort1 === "low" && "menu-dropdown--active")}
            >
                <div>Price: Low to High</div>
            </Menu.Item>
            <Menu.Item
                key="high-low"
                onClick={() => handleSort("high")}
                className={cx(sort1 === "high" && "menu-dropdown--active")}
            >
                <div>Price: High to Low</div>
            </Menu.Item>
        </Menu>
    );
    return (
        <div className={cx("view-nft")}>
            <div className={cx("top")}>
                <div className={cx("title")}>{listNft?.length} Items</div>
                <div className={cx("group-search")}>
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

                    <Button
                        className={cx("button")}
                        onClick={() => {
                            navigate({ search: "?view=false" });
                            setIsMintNFT(true);
                        }}
                    >
                        Mint NFT
                    </Button>
                </div>
            </div>

            <Row>
                {loading ? (
                    <ListSkeleton />
                ) : listNft.length > 0 ? (
                    <div className={cx("list-nft")}>
                       <List listNft={listNft} gameSelected={gameSelected} />
                    </div>
                ) : (
                    <div style={{ margin: "0 auto" }}>
                        <img src={noData} alt="no-data" />
						{/* <div>No data</div> */}
                    </div>
                )}
            </Row>
        </div>
    );
};

export default ViewNFT;
