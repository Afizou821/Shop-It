import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Home from "./components/Home.jsx";
import {Toaster} from 'react-hot-toast';
import "./App.css"
import Productdetails from "./components/product/Productdetails.jsx";
function App() {
  return (
   < Router>
    <div className="App">
    <Toaster  position="top-center" />
     <Header />
     <div className="container">
        <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/product/:id" element={<Productdetails/>}></Route>

        </Routes>
     </div>
      <Footer />
    </div>
  </Router>
  );
}

export default App;
