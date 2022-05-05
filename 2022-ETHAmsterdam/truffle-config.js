const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "src/contracts"),
  networks: {
    develop: {
			host: "localhost",
      port: 8545,
			network_id: 1337
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
		skale: {
			provider: () => new HDWalletProvider(mnemonic, `https://amsterdam.skalenodes.com/v1/attractive-muscida`),
			network_id: 3092851097537429,
		}
  },
  compilers: {
    solc: {
      version: "0.8.4"
    }
  }
};
