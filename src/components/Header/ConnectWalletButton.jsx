import { Button } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "src/utils/hooks/metamask";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConnectWalletModal from "./ConnectWalletModal";

export default function ConnectWalletButton() {
	const context = useWeb3React();
	const navigate = useNavigate();
	const { connector, account } = context;
	const [activatingConnector, setActivatingConnector] = useState();
	const [showConnectModal, setShowConnectModal] = useState(false);

	const triedEager = useEagerConnect();
	useInactiveListener(!triedEager || !!activatingConnector);

	useEffect(() => {
		if (activatingConnector && activatingConnector === connector) {
			setActivatingConnector(undefined);
		}
	}, [activatingConnector, connector]);

	return (
		<>
			<Button
				variant="contained"
				onClick={() => {
					account ? navigate("/profile") : setShowConnectModal(true);
				}}
				className="connect-wallet-btn">
				{account ? "My account" : "Connet wallet"}
			</Button>
			<ConnectWalletModal show={showConnectModal} setShow={setShowConnectModal} />
		</>
	);
}
