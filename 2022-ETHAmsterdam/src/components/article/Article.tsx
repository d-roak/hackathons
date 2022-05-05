import { useParams } from "react-router-dom";
import {
  Box,
	Center,
  Heading,
  Text,
  Stack,
  Avatar,
	HStack,
	Tag,
	VStack,
} from '@chakra-ui/react';
import { stringToColor } from "../../utils";
import moment from "moment";
import axios from "axios";
import { useState } from "react";

function Article() {
	const { cid } = useParams();

	let empty:any = {};
	const [data, setData] = useState(empty);

	axios.get('https://'+cid+'.ipfs.nftstorage.link').then((res: any) => {
		res.data['tags'] = [res.data['tags']];
		res.data['references'] = [res.data['references']];
		res.data['cid'] = cid;
		setData(res.data);
	});

	return (
		<Center>
			<VStack>
				<Heading
					color={'gray.700'}
					fontSize={'4xl'}
					fontFamily={'body'}>
					{data.title}
				</Heading>
				<HStack>
					{
						data.tags?.map((tag: string) => {
							return <Tag backgroundColor={stringToColor(tag)} color={"white"} fontSize={'sm'}>{tag}</Tag>
						})
					}
				</HStack>
				<Stack mt={5} direction={'row'} spacing={4} align={'center'}>
					<Avatar
						src={'https://raw.githubusercontent.com/hashdog/node-identicon-github/master/examples/images/github.png'}
					/>
					<Stack direction={'column'} spacing={0} fontSize={'sm'}>
						<Text fontWeight={600}>{data.author}</Text>
						<Text color={'gray.500'}>{moment(data.date).format('MMM DD, YYYY')}</Text>
					</Stack>
				</Stack>
				<Text color={'gray.500'}>
					{data.content}
				</Text>
			</VStack>
		</Center>
	);
}

export default Article;