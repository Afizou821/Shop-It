import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Home from "./components/Home.jsx";

import "./App.css"
function App() {
  return (
   < Router>
    <div className="App">
     <Header />
     <div className="container">
        <Routes>
        <Route path="/" element={<Home/>}></Route>

        </Routes>
     </div>
      <Footer />
    </div>
  </Router>
  );
}

export default App;
