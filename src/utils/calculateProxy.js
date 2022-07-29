import { ethers } from "ethers";
import proxyAbi from "src/utils/abi/proxy-factory.json";
import { read } from "src/lib/web3";

const calculateProxyAddress = async (factoryAddress, singleton, inititalizer, nonce) => {
	const deploymentCode = ethers.utils.solidityPack(
		["bytes", "uint256"],
		[await read("proxyCreationCode", 97, factoryAddress, proxyAbi, []), singleton]
	);
	const salt = ethers.utils.solidityKeccak256(
		["bytes32", "uint256"],
		[ethers.utils.solidityKeccak256(["bytes"], [inititalizer]), nonce]
	);
	return ethers.utils.getCreate2Address(factoryAddress, salt, ethers.utils.keccak256(deploymentCode));
};

export default calculateProxyAddress;
