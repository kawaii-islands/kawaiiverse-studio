import { Box } from "@mui/material";
import Filter from "src/components/Marketplace/Filter";
import Toolbar from "src/components/Marketplace/Toolbar";
import List from "src/components/Marketplace/List";

export default function Marketplace() {
	return (
		<Box display="flex">
			<Filter />
			<Box
				style={{
					height: "calc(100vh - 70px)",
					flex: 1,
					padding: "24px 32px",
					overflowY: "auto",
				}}>
				<Toolbar />
				<List />
			</Box>
		</Box>
	);
}
