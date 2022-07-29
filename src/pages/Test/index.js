import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import proxyAbi from "src/utils/abi/proxy-factory.json";
import multisigAbi from "src/utils/abi/multi-sig.json";
import Web3 from "web3";
import { read, write } from "src/lib/web3";
import calculateProxyAddress from "src/utils/calculateProxy";
import { ethers } from "ethers";
import authorityAbi from "src/utils/abi/authority.json";
import { buildSignatureBytes } from "src/utils/utils";

export default function Test() {
	const { account, library } = useWeb3React();

	useEffect(() => {
		if (!library?.provider) return;
		console.log(library.provider);
		const a = new ethers.providers.Web3Provider(library.provider);
		console.log(a);
		const signer = a.getSigner();
		console.log(signer);
	}, [library?.provider]);

	useEffect(() => {
		(async () => {
			const proxyAddress = await calculateProxyAddress(
				"0xf11c0735bF690eB722232Dd3Ab49b174Dc183328",
				"0x44060C16c933E1749767648CaD329d298af8C386",
				"0xb63e800d00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f22430000000000000000000000000000000000000000000000000000000000000140000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f2243000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f22430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f22430000000000000000000000000000000000000000000000000000000000000001000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f22430000000000000000000000000000000000000000000000000000000000000000",
				1658998841732
			);
			console.log(proxyAddress);
		})();
	}, []);

	const onClick = async () => {
		try {
			const web3 = new Web3(library.provider);
			const multiSigContract = new web3.eth.Contract(multisigAbi, "0x44060C16c933E1749767648CaD329d298af8C386");
			const gnosisSafeData = multiSigContract.methods
				.setup([account], 1, account, "0x", account, account, 0, account)
				.encodeABI();
			write(
				"createProxyWithNonce",
				library.provider,
				"0xf11c0735bF690eB722232Dd3Ab49b174Dc183328",
				proxyAbi,
				["0x44060C16c933E1749767648CaD329d298af8C386", gnosisSafeData, Date.now()],
				{ from: account }
			);
		} catch (error) {
			console.log(error);
		}
	};

	const sign = async () => {
		try {
			const web3 = new Web3(library.provider);
			let stringAuthority = "test";
			const proxyAddress = await calculateProxyAddress(
				"0xf11c0735bF690eB722232Dd3Ab49b174Dc183328",
				"0x44060C16c933E1749767648CaD329d298af8C386",
				"0xb63e800d00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f22430000000000000000000000000000000000000000000000000000000000000140000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f2243000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f22430000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f22430000000000000000000000000000000000000000000000000000000000000001000000000000000000000000e378fc973578f5619d2fb4ffcf92c7210a8f22430000000000000000000000000000000000000000000000000000000000000000",
				1658998841732
			);
			const multiSigContract = new web3.eth.Contract(multisigAbi, proxyAddress);
			const authorityContract = new web3.eth.Contract(authorityAbi, "0xE128e0B0F164F0d7470555956D464d1d96e9d967");
			const authorityData = authorityContract.methods.setAuthority(stringAuthority).encodeABI();
			let nonce = 0;
			const tx = [
				"0xE128e0B0F164F0d7470555956D464d1d96e9d967",
				0,
				authorityData,
				"0",
				"0",
				"0",
				"0",
				account,
				account,
				nonce,
			];

			const transactionHash = await multiSigContract.methods
				.getTransactionHash(
					"0xE128e0B0F164F0d7470555956D464d1d96e9d967",
					0,
					authorityData,
					"0",
					"0",
					"0",
					"0",
					account,
					account,
					nonce
				)
				.call();
			console.log(transactionHash);
			const typedDataHash = ethers.utils.arrayify(transactionHash);
			const a = new ethers.providers.Web3Provider(library.provider);
			const signer = a.getSigner();
			const b = (await signer.signMessage(typedDataHash)).replace(/1b$/, "1f").replace(/1c$/, "20");
			console.log(b);
			const signatures = buildSignatureBytes([
				{
					signer: account,
					data: b,
				},
			]);
			const transaction = await multiSigContract.methods
				.execTransaction(
					"0xE128e0B0F164F0d7470555956D464d1d96e9d967",
					0,
					authorityData,
					"0",
					"0",
					"0",
					"0",
					account,
					account,
					signatures
				)
				.send({ from: account });
			console.log(transaction);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<button onClick={onClick}>Click</button>
			<button onClick={sign}>Sign</button>
		</div>
	);
}
