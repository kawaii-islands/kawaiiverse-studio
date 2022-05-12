import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState, useRef } from "react";

const links = [
	{
		title: "About",
		link: "/",
	},
	{
		title: "Store",
		link: "/",
	},
	{
		title: "Game",
		link: "/",
		children: [
			{
				title: "Game1",
				link: "/",
			},
			{
				title: "Game2",
				link: "/",
			},
			{
				title: "Game3",
				link: "/",
			},
		],
	},
];

const Dropdown = ({ item }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const { children, title } = item;
	const open = event => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		}
	};
	const close = () => setAnchorEl(null);

	return (
		<>
			<div className="nav-link" onMouseOver={open} aria-owns={anchorEl ? "dropdown" : undefined} aria-haspopup="true">
				{title}
			</div>
			<Menu
				id="dropdown"
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={close}
				style={{
					top: "-10px",
				}}
				MenuListProps={{ onMouseLeave: close, className: "dropdown-menu" }}>
				{children.map(item => (
					<MenuItem key={item.title}>{item.title}</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default function NavLinks() {
	return (
		<Box display="flex" justifyContent="center">
			{links.map(item => {
				if (item.children) return <Dropdown item={item} />;
				return (
					<Link to={item.link} key={item.title} className="nav-link">
						{item.title}
					</Link>
				);
			})}
		</Box>
	);
}
