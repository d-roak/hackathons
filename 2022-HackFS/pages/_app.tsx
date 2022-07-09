
import { Box, createTheme, CssBaseline, ThemeProvider, Toolbar } from '@mui/material';
import type { AppProps } from 'next/app'
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function MyApp({ Component, pageProps }: AppProps) {
	const drawerWidth = 240;
	const prevent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.preventDefault();
	return (
    <ThemeProvider theme={darkTheme}>
			<Box sx={{ display: 'flex' }} onContextMenu={prevent}>
				<CssBaseline />
				<Header />
				<Sidebar />
				<Box
					component="main"
					sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
				>
					<Toolbar />
					<Component {...pageProps} />
				</Box>
			</Box>
    </ThemeProvider>
	)
}

export default MyApp
