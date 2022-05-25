import { Pagination } from "@mui/material";
import styles from "./index.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);

export default props => {
	if (props?.count <= 1) return <></>;
	return <Pagination {...props} className={cx("pagination")} />;
};
