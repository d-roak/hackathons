import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  BookmarkAltIcon,
  CalendarIcon,
  MenuIcon,
  ShieldCheckIcon,
  SupportIcon,
  XIcon,
} from '@heroicons/react/outline'
import { Link } from "react-router-dom"
import { ChevronDownIcon } from '@heroicons/react/solid'
import { useWeb3React } from '@web3-react/core'
import { networkParams } from "../../networks"
import { toHex } from "../../utils"
import SelectWalletModal from '../../auth/AuthModal'
import { useDisclosure } from '@chakra-ui/react'

const networks = [
  {
    name: 'Help Center',
    description: 'Get all of your questions answered in our forums or contact support.',
    href: '#',
    icon: SupportIcon,
  },
  {
    name: 'Guides',
    description: 'Learn how to maximize our platform to get the most out of it.',
    href: '#',
    icon: BookmarkAltIcon,
  },
  {
    name: 'Events',
    description: 'See what meet-ups and other events we might be planning near you.',
    href: '#',
    icon: CalendarIcon,
  },
  { name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#', icon: ShieldCheckIcon },
]

function classNames(...classes:any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		library,
		chainId,
		active,
		deactivate
	} = useWeb3React()

	const [network, setNetwork] = useState(chainId)
	const handleNetwork = (e: any) => {
		const id = Number(e.target.value)
		setNetwork(id)
		switchNetwork()
	}

  const switchNetwork = async () => {
    try {
			if(network === -1) return
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network) as keyof typeof networkParams]]
          })
        } catch (error: any) {
					console.log(error)
        }
      }
    }
	}

  const refreshState = () => {
    window.localStorage.setItem("provider", "")
    setNetwork(-1)
  }

  const disconnect = () => {
    deactivate()
    refreshState()
  }

  return (
    <Popover className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
						<Link className='text-white font-bold text-lg' to='/'>
            	Copycat
            </Link>
          </div>

					{active ? (
          <Popover.Group as="nav" className="bg-gray-900 px-4 py-2 border border-transparent rounded-xl hidden md:flex space-x-10">
						<Link className="text-base font-medium text-gray-500 hover:text-gray-900" to={"/listing"}>
							Listing
						</Link>
						<Link className="text-base font-medium text-gray-500 hover:text-gray-900" to={"/copy"}>
							Copy
						</Link>
          </Popover.Group>
					):(<></>)}

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
						<Popover.Group>	
							<Popover className="relative">
								{({ open }:{open:any}) => (
									<>
										<Popover.Button
											className='group bg-gray-900 text-gray-400 px-4 py-2 rounded-xl inline-flex items-center text-base font-medium focus:outline-none'
										>
											<span>Polygon</span>
											<ChevronDownIcon
												className={classNames(
													open ? 'text-gray-600' : 'text-gray-400',
													'ml-2 h-5 w-5 group-hover:text-gray-500'
												)}
												aria-hidden="true"
											/>
										</Popover.Button>

										<Transition
											as={Fragment}
											enter="transition ease-out duration-200"
											enterFrom="opacity-0 translate-y-1"
											enterTo="opacity-100 translate-y-0"
											leave="transition ease-in duration-150"
											leaveFrom="opacity-100 translate-y-0"
											leaveTo="opacity-0 translate-y-1"
										>
											<Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0">
												<div className="rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
													<div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
														{networks.map((item) => (
															<a
																key={item.name}
																href={item.href}
																className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
															>
																<item.icon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
																<div className="ml-4">
																	<p className="text-base font-medium text-gray-900">{item.name}</p>
																	<p className="mt-1 text-sm text-gray-500">{item.description}</p>
																</div>
															</a>
														))}
													</div>
												</div>
											</Popover.Panel>
										</Transition>
									</>
								)}
							</Popover>
						</Popover.Group>

						<div 
							className="ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
							onClick={onOpen}>
							Connect Wallet
						</div>
						<SelectWalletModal isOpen={isOpen} closeModal={onClose} />
          </div>
        </div>
      </div>
    </Popover>
  )
}