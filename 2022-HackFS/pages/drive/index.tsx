import { Button } from '@mui/material'
import type { NextPage } from 'next'
import React from 'react';

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Drive as DriveComponent, createData } from '../../components/Drive/Drive';

	
const Drive: NextPage = () => {
	const data = [
		createData('folder', 'Folder 1', 'Jun 30, 2022 me', '-', '-'),
		createData('folder', 'Folder 2', 'Jun 30, 2022 me', '-', '-'),
		createData('folder', 'Folder 3', 'Jun 30, 2022 me', '-', '-'),
		createData('folder', 'Folder 4', 'Jun 30, 2022 me', '-', '-'),
		createData('folder', 'Folder 5', 'Jun 30, 2022 me', '-', '-'),
		createData('file', 'File 1.txt', 'Jun 30, 2022 me', 25475400, 'bafkreiabltrd5zm73pvi7plq25pef3hm7jxhbi3kv4hapegrkfpkqtkbme'),
		createData('file', 'File 2.txt', 'Jun 30, 2022 me', 83019200, 'bafkreidrsgkip425zjamc3pvmil7dpatss7ncedyaatepxyionxi7py5fq'),
		createData('file', 'File 3.txt', 'Jun 30, 2022 me', 4857000, 'bafkreiaqv66m5nd6mwgkk7h5lwqnjzj54s4f7knmnrjhb7ylzqfg2vdo54'),
	];

	return (
		<>
			<Button variant="outlined" startIcon={ <CreateNewFolderIcon /> } sx={{ margin: '0 5px 0 0', color: '#dedede', borderColor: '#757575' }}>New Folder</Button>
			<Button variant="outlined" startIcon={ <UploadFileIcon /> } sx={{ color: '#dedede', borderColor: '#757575' }}>Upload File</Button>

			<DriveComponent data={data} />
		</>
	)
}

export default Drive
