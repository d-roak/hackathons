import { Center, List, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { Link } from "react-router-dom";
import Article from "../../contracts/Article.json";
import SinglePost from "./SinglePost";
import axios from 'axios';
import { useState } from "react";

function Listing() {
	let empty:any[] = [];
	const [articles, setArticles] = useState(empty);

	const {
		library,
		chainId,
	} = useWeb3React();

	async function list() {
		let articles: any[] = [];
		try {
			const deployedNetwork = Article.networks[chainId as unknown as keyof typeof Article.networks];
			const contract = new Contract(deployedNetwork.address, Article.abi, library.getSigner());
			const total = await contract.totalSupply();
			for (let i = total; i > Math.max(total-5, 0); i--) {
				const article = await contract.tokenURI(i-1);
				await axios.get('https://'+article+'.ipfs.nftstorage.link').then((res: any) => {
					res.data['tags'] = [res.data['tags']];
					res.data['references'] = [res.data['references']];
					res.data['cid'] = article
					articles.push(res.data);
				});
			}
		} catch(error) {
			console.error(error);
		}

		setArticles(articles);
	}

	list();

	return (
		<div>
			<Center>
				<Text fontSize="xl" fontWeight="bold">Recent News</Text>
			</Center>
			<List>
				{
					articles.map((article: any) => {
						return <Link to={`/articles/`+article.cid}><SinglePost data={article} /></Link>
					})
				}
			</List>
		</div>
	);
}

export default Listing;