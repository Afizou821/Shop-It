import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Home from "./components/Home.jsx";
import {Toaster} from 'react-hot-toast';
import Login from "./components/auth/Login.jsx";
import "./App.css"
import Productdetails from "./components/product/Productdetails.jsx";
import Register from "./components/auth/Register.jsx";
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
        <Route path ="/login"  element= {<Login/>} />
        <Route path ="/register"  element= {<Register/>} />

        </Routes>
     </div>
      <Footer />
    </div>
  </Router>
  );
}

export default App;
