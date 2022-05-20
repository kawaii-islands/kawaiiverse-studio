import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Col } from "antd";
import cn from "classnames/bind";
import styles from "./Card.module.scss";
const cx = cn.bind(styles);

const CardSkeleton = ({ page }) => {
	return (
		<SkeletonTheme baseColor="#ffddb9" highlightColor="#FDF5E8" duration={2}>
			<div className={cx("nft-skeleton")}>
				<section className={cx("skeleton")}>
					<Skeleton height={20} width={100} />
					<div style={{ marginTop: 8 }}></div>
					<Skeleton width={"100%"} height={160} />
					<div style={{ marginBottom: 6 }}></div>
					<Skeleton height={22} width={150} />
					{page && (
						<>
							<div style={{ marginTop: 8 }}></div>
							<Skeleton height={24} width={180} />
						</>
					)}
				</section>
			</div>
		</SkeletonTheme>
	);
};
export default CardSkeleton;
