import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import Draggable from 'react-draggable';
import Link from 'next/link'
import React from 'react';

import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlineIcon from '@mui/icons-material/DescriptionOutlined';

import { MenuComponent } from './Menu';


interface Column {
  id: 'name' | 'code' | 'size' | 'cid';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: string) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170, align: 'left' },
  { id: 'code', label: 'Last Modified', minWidth: 100, align: 'center' },
  { id: 'size', label: 'File Size', minWidth: 170, align: 'center',
		format: (value: string) => {
			if (value === '-')
				return '-'

			// convert bytes to KB, MB, GB, etc
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (value === '0')
				return '0 Bytes';
			
			const i = parseInt(value, 10) === 0 ? 0 : Math.floor(Math.log(parseInt(value, 10)) / Math.log(1024));
			return `${parseFloat((parseInt(value, 10) / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
		}
	},
  { id: 'cid', label: 'CID', minWidth: 100, align: 'center',
		format: (value: string) => value === '-' ? '-': value.substring(0, 7) + ' ... ' + value.substring(value.length - 7, value.length)
	},
];

// Add location for files not on 'My Drive'
// Add shared by for files on 'Shared'
interface Data {
	type: string;
  name: string;
  code: string;
  size: number | string;
	cid: string;
}

export function createData(
	type: string,
  name: string,
  code: string,
  size: number | string,
	cid: string,
): Data {
  return { type, name, code, size, cid };
}

export const Drive = (props: {data: Data[]}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [menuEv, setMenuEv] = React.useState<any|null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenOptions = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
    setMenuEv(event);
  };

  return (
		<>
			<Paper sx={{ width: '100%', overflow: 'hidden' }}>
				<TableContainer sx={{
					maxHeight: `calc(100vh - 210px)`,
					"&::-webkit-scrollbar": {
					width: 5
					},
					"&::-webkit-scrollbar-thumb": {
					backgroundColor: "#757575",
					borderRadius: 2
					}
				}}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										sx={{
											minWidth: column.minWidth,
											cursor: 'default',
											"&::selection": { background: "none" }
										}}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{props.data
								?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {
									return (
										<>
											<TableRow hover role="checkbox" tabIndex={-1} key={row.code} onContextMenu={handleOpenOptions}>
												{columns.map((column) => {
													const value = row[column.id];
													return (
														<>
															<TableCell
																key={column.id}
																align={column.align}
																sx={{
																	minWidth: column.minWidth,
																	cursor: 'default',
																	"&::selection": { background: "none" }
																}}
															>
																{column.id === 'name' ? row.type === 'folder' ? <FolderIcon sx={{ verticalAlign:"middle" }} /> : <DescriptionOutlineIcon sx={{ verticalAlign:"middle" }} /> : <></>}
																&emsp; 
																{column.format ?
																	column.format(value.toString())
																	: value}
															</TableCell>
														</>
													);
												})}
											</TableRow>
											<MenuComponent
												menuEv={menuEv}
												setMenuEv={setMenuEv}
											/>
										</>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={props.data?.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</>
  );
}