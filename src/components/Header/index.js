import { AppBar, Toolbar, Box, Button } from "@mui/material";
import styled from "@emotion/styled";
import NavLinks from "./NavLinks";
import "./index.scss";

export default function Header() {
	return (
		<AppBar position="fixed" color="secondary">
			<Toolbar className="app-header">
				<Box display="flex">
					<img
						className="app-header-logo"
						src="https://s3-alpha-sig.figma.com/img/4f2f/2b05/d806649bf562617a9038855cbd2e862f?Expires=1653264000&Signature=dT6JpbcIrAEzykVShWE7faplwRBvlZ59AfToNiNg0oQRhxE52ozWD-KWc5hhoNpMFAayNgnX0RnQ3rAxFcgXZVnMQUtEJqIoCcxsnWXrFEGLZRbtIkxp-q4JEyiXVUqsOxAYnCND-IwaWILiuzzfUWWfPifbPAeasTya3xOPCinrVkj-aTAnBJ~ruWYe94AjLePYJkyjyhJ1P7E~9ROV1xtS1mUEXrEPELDWno650AcuLyf4zuo8Y3ZEQ6RMg0fKXcdeaLlzadLYQ151yiEQdhFmwZbQk2h9DHNShd-x3cWd2seteJFAVRJbJLIBZvCeLr7hWWbIOfuhpMEIrEiU-g__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
					/>
					<NavLinks />
				</Box>
				<Button variant="contained">My account</Button>
			</Toolbar>
		</AppBar>
	);
}
