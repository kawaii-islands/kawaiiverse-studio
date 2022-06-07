import styles from "./index.module.scss";
import cn from "classnames/bind";

const cx = cn.bind(styles);
import loadingProcess from "src/assets/icons/loading1.png";

export default function Spin({ width }) {
	return (
		<span className={cx("spin")}>
			<img src={loadingProcess} alt="loading-icon" className={cx("loading-icon")} width={width || 24} />
		</span>
	);
}
