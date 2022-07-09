import { Alert } from '@mui/material'
import type { NextPage } from 'next'
import { createData, Drive } from '../../components/Drive/Drive'

const Trash: NextPage = () => {
	const data = [
		createData('file', 'File 4.txt', 'Jun 30, 2022 me', 25475400, 'bafkreiabltrd5zm73pvi7plq25pef3hm7jxhbi3kv4hapegrkfpkqtkbme'),
		createData('file', 'File 5.txt', 'Jun 30, 2022 me', 4857000, 'bafkreiaqv66m5nd6mwgkk7h5lwqnjzj54s4f7knmnrjhb7ylzqfg2vdo54'),
	];

	return (
		<>
			<Alert severity="warning">We will stop pinning your files, but as long as nodes retain copies of the data they will be available!</Alert>
			<Drive data={data} />
		</>
	)
}

export default Trash

