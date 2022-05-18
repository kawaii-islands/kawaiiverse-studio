import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { connectorsByName } from "src/constants/connectors";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Modal, Button } from "@mui/material";
import styled from "@emotion/styled";

const metamask = "https://images.kawaii.global/kawaii-marketplace-image/metamask.svg";
const walletconnectIcon = "https://images.kawaii.global/kawaii-marketplace-image/wallet-connect.svg";
const MetaMask = {
	name: "Metamask",
	icon: metamask,
	id: "MetaMask",
	connector: InjectedConnector,
	connectorName: "MetaMask",
};
const WalletConnect = {
	name: "Wallet Connect",
	icon: walletconnectIcon,
	id: "WalletConnect",
	connector: WalletConnectConnector,
	connectorName: "WalletConnect",
};

const CONNECTORS = [MetaMask, WalletConnect];
const ConnectButton = styled(Button)`
	width: 100%;
	height: 60px;
	color: #9b5931;
	font-weight: 600;
	font-size: 20px;
	background: #fef1d1;
	margin-bottom: 26px;
	&:hover {
		color: #9b5931;
		background: #fef1d1;
	}
	&:last-child {
		margin-bottom: 0;
	}
	img {
		height: 45px;
		margin-right: 16px;
	}
`;

const Deactivate = styled(Button)`
	width: 100%;
	height: 60px;
`;

const ConnectWalletModal = ({ show, setShow, alwaysShow }) => {
	const context = useWeb3React();
	const { connector, activate, account, deactivate } = context;
	const [activatingConnector, setActivatingConnector] = useState();
	useEffect(() => {
		if (activatingConnector && activatingConnector === connector) {
			setActivatingConnector(undefined);
		}
	}, [activatingConnector, connector]);

	const connectWallet = async name => {
		const currentConnector = connectorsByName[name];
		setActivatingConnector(currentConnector);
		await activate(connectorsByName[name]);
		setShow(false);
	};

	return (
		<Modal
			open={show}
			animation="true"
			onClose={() => {
				if (alwaysShow) return;
				setShow(false);
			}}>
			<div className="connect-modal">
				<div className="connect-modal-top">
					<div className="connect-modal-top-title">Connect Wallet</div>
					<div className="connect-modal-top-description">
						Connect with one of available wallet providers or create a new wallet
					</div>
				</div>
				<div className="connect-modal-connectors">
					{CONNECTORS.map((connector, idx) => (
						<ConnectButton variant="contained" key={idx} onClick={() => connectWallet(connector.connectorName)}>
							<img src={connector.icon} />
							<div>{connector.name}</div>
						</ConnectButton>
					))}
					{account && (
						<Deactivate variant="contained" color="primary" onClick={deactivate}>
							Deactivate
						</Deactivate>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default ConnectWalletModal;
