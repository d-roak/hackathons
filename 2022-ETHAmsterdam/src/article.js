import Article from "./contracts/Article.json";
import { useWeb3React } from '@web3-react/core';

class ArticleJs {

	static async init() {
		try {
			const web3 = await getWeb3();

			let accounts = await web3.eth.getAccounts();
			console.log("accounts1: ", accounts);

			const networkId = await web3.eth.net.getId();
			const deployedNetwork = Article.networks[networkId];
			const instance = new web3.eth.Contract(
				Article.abi, deployedNetwork && deployedNetwork.address
			);
			
			return {accounts, instance};
		} catch(error) {
			console.error(error);
		}
	}

  static async mint(cid) {
		try {
			const deployedNetwork = Article.networks[chainId as unknown as keyof typeof Article.networks];
			const contract = new Contract(deployedNetwork.address, Article.abi, library.getSigner());
			await contract.mintArticle(cid, { from: account });
		} catch(error) {
			console.error(error);
		}
	}

	removeFromAllowed = async (address) => {
		try {
			const {accounts, instance} = await this.init();

			instance.methods.removeFromAllowed(address).send({
				from: accounts[0]
			});
		} catch(error) {
			console.error(error);
		}
	}


}

export default ArticleJs;