import { AppBar, Toolbar, Box, Button } from "@mui/material";
import styled from "@emotion/styled";
import NavLinks from "./NavLinks";
import "./index.scss";
import ConnectWalletButton from "./ConnectWalletButton";
import Logo from "src/assets/images/logo.png";

export default function Header() {
	return (
		<AppBar position="fixed" color="secondary">
			<Toolbar className="app-header">
				<Box display="flex">
					<img className="app-header-logo" src={Logo} />
					<NavLinks />
				</Box>
				<ConnectWalletButton />
			</Toolbar>
		</AppBar>
	);
}
