import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { VStack } from "@chakra-ui/react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";

function App() {
  return (
    <>
			<BrowserRouter>
				<Header></Header>
				<VStack justifyContent="center" alignItems="center" display="block" overflowY="scroll" padding="25">
					<Routes>
						<Route path='/' element={<Home/>}/>
					</Routes>
				</VStack>
				<Footer></Footer>
			</BrowserRouter>
    </>
  );
}

export default App;
