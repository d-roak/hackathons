import { useForm } from 'react-hook-form'
import {
  FormControl,
  Input,
	Center,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

function CopyModal({ isOpen, closeModal }: {isOpen: any, closeModal: any}) {
	const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm()

  async function onSubmit(values: any) {
  }

	return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent w="300px">
        <ModalHeader>Copy Address</ModalHeader>
        <ModalCloseButton
          _focus={{
            boxShadow: "none"
          }}
        />
        <ModalBody paddingBottom="1.5rem">
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl mt={4}>
							<Input
								id='address'
								placeholder='Address'
								{...register('address')}
							/>
						</FormControl>
						<FormControl mt={4}>
							<Input
								id='token'
								placeholder='Token'
								{...register('token')}/>
						</FormControl>
						<FormControl mt={4}>
							<Input
								id='amount'
								placeholder='Amount'
								{...register('amount')}/>
						</FormControl>

						<Center>
							<Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
								Copy
							</Button>
						</Center>
					</form>
        </ModalBody>
      </ModalContent>
    </Modal>
	);
}

export default CopyModal;