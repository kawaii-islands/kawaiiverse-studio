import { Contract, Wallet, utils, BigNumber, BigNumberish, Signer, PopulatedTransaction } from "ethers";

export const signHash = async (signer, hash) => {
	const typedDataHash = utils.arrayify(hash);
	const signerAddress = await signer.getAddress();
	return {
		signer: signerAddress,
		data: (await signer.signMessage(typedDataHash)).replace(/1b$/, "1f").replace(/1c$/, "20"),
	};
};

export const buildSignatureBytes = signatures => {
	signatures.sort((left, right) => left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()));
	let signatureBytes = "0x";
	for (const sig of signatures) {
		signatureBytes += sig.data.slice(2);
	}
	return signatureBytes;
};
