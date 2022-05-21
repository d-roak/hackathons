import { useWeb3React } from '@web3-react/core';
import { Contract, utils } from 'ethers';
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Copycat from '../../artifacts/contracts/Copycat.sol/Copycat.json'
import { contractAddr } from '../../networks';

function Listing() {
	const {
		library,
	} = useWeb3React();

  const [active, setActive] = useState(false)
  const [height, setHeight] = useState('0px')
  const [rotate, setRotate] = useState('transform duration-700 ease rotate-180')
	const [wallets, setWallets] = useState([])
	const [balances, setBalances] = useState({})
	const [feeBalances, setFeeBalances] = useState({})
	const [quoteRate, setQuoteRate] = useState({})

	const contentSpace = useRef<HTMLDivElement>(null)

  function toggleAccordion(e:any) {
    setActive((prevState) => !prevState)
    // @ts-ignore
    setHeight(active ? '0px' : `${contentSpace.current.scrollHeight}px`)
    setRotate(active ? 'transform duration-700 ease rotate-180' : 'transform duration-700 ease')
  }

	useEffect(() => {
		if(!library) return
		const contract = new Contract(contractAddr, Copycat.abi, library.getSigner())
		contract.getAddressesBeingCopied().then((d:any) => {
			setWallets(d)
			d.forEach((addr:string) => {
				contract.balance(addr).then((b:any) => {
					setBalances({
						...balances,
						[addr]: (+utils.formatEther(b)).toFixed(4)
					})
				})
				contract.feeBalance(addr).then((b:any) => {
					setFeeBalances({
						...feeBalances,
						[addr]: (+utils.formatEther(b)).toFixed(4)
					})
				})
			})
		})
		if(!quoteRate["MATIC" as keyof typeof quoteRate]){
			getUSD("MATIC").then(r => {
				setQuoteRate({
					...quoteRate,
					MATIC: r
				});
			})
		}
	}, [balances, feeBalances, library, quoteRate])

	const getUSD = async (token:string) => {
		const response = await fetch('https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=' + token + '&key=ckey_be6ce18e2e8743df94fe7c614eb');
		const json = await response.json();
		let res = json.data.items[0].quote_rate;
		return res;
	}

	return (
		<>
			<div className='w-1/2 mt-10 mx-auto'>
				<div className='flex justify-between mb-2'>
					<h1 className="text-white ml-1 font-bold text-lg">
						Open Positions
					</h1>
					<Link className="justify-end content-end" to={"/copy"}>
						<button className='bg-gray-900 px-4 py-2 border border-transparent rounded-xl hidden md:flex text-gray-400'>+ New Copy</button>
					</Link>
				</div>

				<div className="flex flex-col">
					{wallets.map((item) => (
						<>
							<button
								className="p-5 box-border appearance-none cursor-pointer focus:outline-none flex items-center justify-between
									border-gray-700 border-b-0 text-white bg-gray-800 hover:bg-gray-800 first:rounded-t-xl last:rounded-b-xl"
								onClick={toggleAccordion}
							>
								<p className="inline-block text-footnote light">{item}</p>
								<svg data-accordion-icon className={`${rotate} inline-block w-6 h-6`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
							</button>
							<div
								ref={contentSpace}
								style={{ maxHeight: `${height}` }}
								className="overflow-hidden transition-max-height duration-700 ease-in-out
									text-gray-400 bg-gray-900 border border-gray-700 border-b-0"
							>
								<div className="text-gray-400 p-5">
									<p>Balance: {balances[item] + " MATIC ($" + (balances[item]*quoteRate["MATIC" as keyof typeof quoteRate]).toFixed(4) + ")"}</p>
									<p>Fee Balance: {feeBalances[item] + " MATIC ($" + (feeBalances[item]*quoteRate["MATIC" as keyof typeof quoteRate]).toFixed(4) + ")"}</p>
								</div>
						
								<div 
								className="ml-4 mb-5 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
								>
								Withdraw
							</div>
							</div>
						</>
					))}
				</div>
			</div>
		</>
	);
}

export default Listing;