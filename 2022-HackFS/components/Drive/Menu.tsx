import { DeleteOutline, DriveFileRenameOutline, FileDownloadOutlined, InfoOutlined, ShareOutlined } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem, Menu, Paper } from '@mui/material';
import React from 'react';

export const MenuComponent = (props : {menuEv:any, setMenuEv:any}) => {

  const handleCloseOptions = () => {
    props.setMenuEv(null);
  };

  return (
		<Paper
				sx={{boxShadow: '0px 2px 1px -3px rgb(0 0 0 / 2%), 0px 3px 10px 1px rgb(0 0 0 / 14%), 0px 3px 13px 2px rgb(0 0 0 / 1%) !important'}}>
      <Menu
				keepMounted
				anchorReference='anchorPosition'
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				anchorPosition={{
					top: props.menuEv?.clientY,
					left: props.menuEv?.clientX,
				}}
        open={Boolean(props.menuEv)}
        onClose={handleCloseOptions}>
        <MenuItem>
          <ListItemIcon>
            <FileDownloadOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DriveFileRenameOutline fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DeleteOutline fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ShareOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <InfoOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Info</ListItemText>
        </MenuItem>
      </Menu>
		</Paper>
  );
};