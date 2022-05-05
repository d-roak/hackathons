import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { VStack } from "@chakra-ui/react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import Listing from './components/listing/Listing';
import Article from './components/article/Article';
import NewArticle from './components/article/NewArticle';

function App() {
	return (
		<>
			<BrowserRouter>
				<Header></Header>
				<VStack justifyContent="center" alignItems="center" display="block" overflowY="scroll" padding="25">
					<Routes>
						<Route path='/' element={<Home/>}/>
						<Route path='/articles' element={<Listing/>}/>
						<Route path='/articles/:cid' element={<Article/>}/>
						<Route path='/write' element={<NewArticle/>}/>
					</Routes>
				</VStack>
				<Footer></Footer>
			</BrowserRouter>
    </>
  );
}

export default App;
