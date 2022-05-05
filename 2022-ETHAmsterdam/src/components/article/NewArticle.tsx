import { useForm } from 'react-hook-form'
import {
  Text,
  FormControl,
  Input,
	Center,
  Button,
	Textarea,
} from '@chakra-ui/react'
import storeArticle from '../../nft-storage'
import Article from '../../contracts/Article.json'
import { CIDString } from 'nft.storage';
import { useWeb3React } from '@web3-react/core';
import { Contract } from 'ethers';
import { useNavigate } from 'react-router-dom';

function NewArticle() {
	const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm()

	const {
		library,
		chainId,
		account,
	} = useWeb3React();

	let navigate = useNavigate();

	async function removeFromAllowed(address: string) {
		try {
			const deployedNetwork = Article.networks[chainId as unknown as keyof typeof Article.networks];
			const contract = new Contract(deployedNetwork.address, Article.abi, library.getSigner);
			await contract.removeFromAllowed(address, { from: account });
		} catch(error) {
			console.error(error);
		}
	}

	async function addToAllowed(address: string) {
		try {
			const deployedNetwork = Article.networks[chainId as unknown as keyof typeof Article.networks];
			const contract = new Contract(deployedNetwork.address, Article.abi, library.getSigner);
			await contract.addToAllowed(address, {from: account});
		} catch(error){
			console.error(error);
		}
	}

	async function isAllowed(address: string) {
		try {
			const deployedNetwork = Article.networks[chainId as unknown as keyof typeof Article.networks];
			const contract = new Contract(deployedNetwork.address, Article.abi, library.getSigner);
			await contract.isAllowed(address, { from: account });
		} catch(error) {
			console.error(error)
		}
	}

	async function mint(cid: CIDString) {
		try {
			const deployedNetwork = Article.networks[chainId as unknown as keyof typeof Article.networks];
			const contract = new Contract(deployedNetwork.address, Article.abi, library.getSigner());
			await contract.mintArticle(cid, { from: account });
		} catch(error) {
			console.error(error);
		}
	}

  async function onSubmit(values: any) {
		values['date'] = new Date().toISOString();
		const cid = await storeArticle(values)
		await mint(cid);
		navigate(`/articles/${cid}`);
  }

	return (
		<Center>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Text fontSize="2xl" fontWeight="bold" display="block">Add an awesome Article!</Text>
				<FormControl mt={4}>
					<Input
						id='author'
						placeholder='Author'
						{...register('author')}
					/>
				</FormControl>
				<FormControl mt={4}>
					<Input
						id='title'
						placeholder='Title'
						{...register('title')}/>
				</FormControl>
				<FormControl mt={4}>
					<Input
						id='tags'
						placeholder='Tags'
						{...register('tags')}/>
				</FormControl>
				<FormControl mt={4}>
					<Input
						id='refs'
						placeholder='References'
						{...register('references')}/>
				</FormControl>
				<FormControl mt={4}>
					<Textarea
						id='content'
						placeholder='Content'
						{...register('content')}/>
				</FormControl>

				<Center>
					<Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
						Submit
					</Button>
				</Center>
			</form>
		</Center>
	);
}

export default NewArticle;