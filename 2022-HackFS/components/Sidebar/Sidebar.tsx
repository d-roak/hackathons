import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderOutlineIcon from '@mui/icons-material/FolderOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SettingsOutlineIcon from '@mui/icons-material/SettingsOutlined';
import GamepadIcon from '@mui/icons-material/Gamepad';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { LinearProgress } from '@mui/material';


export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
	const [container, setContainer] = React.useState<any>(undefined)
	const drawerWidth = 240;

	React.useEffect(() => setContainer(() => window.document.body), [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
			<Toolbar>
				<GamepadIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
				<Typography
					variant="h6"
					noWrap
					sx={{
						display: { xs: 'none', md: 'flex' },
						fontFamily: 'monospace',
						fontWeight: 700,
						letterSpacing: '.3rem',
						color: 'inherit',
						textDecoration: 'none',
						cursor: 'default',
						"&::selection": { background: "none" }
					}}
				>
					IPDrive
				</Typography>
			</Toolbar>
      <Divider />
      <List>
        {['My Drive', 'Shared'].map((text, index) => (
          <ListItem key={text} disablePadding>
						<Link href={index === 0 ? '/drive': '/shared'} passHref>
							<ListItemButton LinkComponent="a">
								<ListItemIcon>
									{index === 0 ? <FolderOutlineIcon /> : <PeopleOutlineIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Recent', 'Trash'].map((text, index) => (
          <ListItem key={text} disablePadding>
						<Link	href={index === 0 ? '/recent': '/trash'} passHref>
							<ListItemButton LinkComponent="a">
								<ListItemIcon>
									{index === 0 ? <ScheduleIcon /> : <DeleteOutlineIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Settings'].map((text, index) => (
          <ListItem key={text} disablePadding>
						<Link href="/settings" passHref>
							<ListItemButton LinkComponent="a">
								<ListItemIcon>
									{index === 0 ? <SettingsOutlineIcon /> : <MailIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</Link>
          </ListItem>
        ))}
      </List>

			<Box sx={{ margin: '0 20px', width: '80%', position: 'absolute', bottom: '20px' }}>
				<Typography variant='caption'>15.61 GB of 20 GB used</Typography>
				<LinearProgress
					variant="determinate"
					value={75} />
			</Box>
    </>
  );

  return (
		<>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
		</>
  );
}