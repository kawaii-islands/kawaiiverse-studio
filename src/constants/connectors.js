import { injected, walletconnect } from "src/utils/connectors";

export const ConnectorNames = {
  MetaMask: "MetaMask",
  WalletConnect: "WalletConnect",
};

export const connectorsByName = {
  [ConnectorNames.MetaMask]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
};
