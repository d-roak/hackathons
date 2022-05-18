import { useWeb3React } from '@web3-react/core';
import { Contract } from 'ethers';
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
		contract.getAddressesBeingCopied().then((d:any) => setWallets(d))
	}, [library])

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
								<p className="text-gray-400 mb-2 p-5">
									Content
								</p>
							</div>
						</>
					))}
				</div>
			</div>
		</>
	);
}

export default Listing;