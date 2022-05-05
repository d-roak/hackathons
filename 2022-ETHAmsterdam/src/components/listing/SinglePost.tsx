import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
	HStack,
	Tag,
} from '@chakra-ui/react';
import Moment from 'moment';
import { stringToColor } from '../../utils';

function SinglePost(input: any) {
	const data = input.data;
  return (
    <Center py={6}>
      <Box
        maxW={'445px'}
        w={'full'}
        bg={'white'}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
        <Stack>
          <Heading
            color={'gray.700'}
            fontSize={'2xl'}
            fontFamily={'body'}>
						{data.title}
          </Heading>
					<HStack>		
						{
							data.tags.map((tag: string) => {
								return <Tag backgroundColor={stringToColor(tag)} color={"white"} fontSize={'sm'}>{tag}</Tag>
							})
						}	
					</HStack>
          <Text color={'gray.500'}>
						{data.content}
          </Text>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          <Avatar
            src={'https://raw.githubusercontent.com/hashdog/node-identicon-github/master/examples/images/github.png'}
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontWeight={600}>{data.author}</Text>
            <Text color={'gray.500'}>{Moment(data.date).format('MMM DD, YYYY')}</Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}

export default SinglePost;