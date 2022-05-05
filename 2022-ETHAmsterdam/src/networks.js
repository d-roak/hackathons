export const networkParams = {
	"0x539": {
		chainId: "0x539",
		rpcUrls: ["http://localhost:7545"],
		chainName: "Localhost Ganache",
		nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
	},
  "0x89": {
    chainId: "0x89",
    rpcUrls: ["https://polygon-rpc.com/"],
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
    blockExplorerUrl: ["https://polygonscan.com/"],
    iconUrls: ["https://cdn.freelogovectors.net/wp-content/uploads/2021/10/polygon-token-logo-freelogovectors.net_.png"]
  },
	"0x13881": {
		chainId: "0x13881",
		rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
		chainName: "Polygon Mumbai",
		nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
		blockExplorerUrl: ["https://mumbai.polygonscan.com/"],
		iconUrls: ["https://cdn.freelogovectors.net/wp-content/uploads/2021/10/polygon-token-logo-freelogovectors.net_.png"]
	},
	"0xafcee83030b95": {
		chainId: "0xafcee83030b95",
		rpcUrls: ["https://amsterdam.skalenodes.com/v1/attractive-muscida"],
		chainName: "SKALE Testnet",
		nativeCurrency: { name: "SKALE ETH", decimals: 18, symbol: "skETH" },
	}
};
