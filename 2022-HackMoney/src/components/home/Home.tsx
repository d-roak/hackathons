import {
	useDisclosure,
	Center,
  Button,
} from '@chakra-ui/react'
import CopyModal from './CopyModal';

function Home() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Center>
			<Button onClick={onOpen}>
				New Copy
			</Button>
			<CopyModal isOpen={isOpen} closeModal={onClose} />
		</Center>
	);
}

export default Home;