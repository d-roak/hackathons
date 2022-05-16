import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { VStack } from "@chakra-ui/react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Copy from './components/copy/Copy';
import Listing from './components/listing/Listing';

function App() {
  return (
    <div className="h-screen bg-gradient-to-r from-indigo-900 to-blue-900">
			<BrowserRouter>
				<Header></Header>
				<VStack justifyContent="center" alignItems="center" display="block" padding="25">
					<Routes>
						<Route path='/' element={<Listing/>}/>
						<Route path='/listing' element={<Listing/>}/>
						<Route path='/copy' element={<Copy/>}/>
					</Routes>
				</VStack>
				<Footer></Footer>
			</BrowserRouter>
    </div>
  );
}

export default App;
