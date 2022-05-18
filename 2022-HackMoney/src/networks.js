export const contractAddr = "0x3b2D802a7257dAE6cC111D7dE0407223D59151e2"

export const networkParams = {
	"0x539": {
		chainId: "0x539",
		rpcUrls: ["http://localhost:7545"],
		chainName: "Localhost",
		nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
	},
	"0x13881": {
		chainId: "0x13881",
		rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
		chainName: "Polygon Mumbai",
		nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
		blockExplorerUrl: ["https://mumbai.polygonscan.com/"],
		iconUrls: ["https://cdn.freelogovectors.net/wp-content/uploads/2021/10/polygon-token-logo-freelogovectors.net_.png"]
	},
};
