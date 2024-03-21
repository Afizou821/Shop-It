import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Home from "./components/Home.jsx";
import {Toaster} from 'react-hot-toast';
import Login from "./components/auth/Login.jsx";
import "./App.css"
import Productdetails from "./components/product/Productdetails.jsx";
import Register from "./components/auth/Register.jsx";
import Profile from "./components/user/Profile.jsx";
import UpdateUserProfile from "./components/user/UpdateUserProfile.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import UploadAvatar from "./components/user/UploadAvatar.jsx";
import UpdatePassword from "./components/user/UpdatePassword.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import Cart from "./components/Cart/Cart.jsx";
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
        <Route path ="/password/forgot"  element= {<ForgotPassword/>} />
        <Route path ="/password/reset/:token"  element= {<ResetPassword/>} />
        <Route path ="/me/profile"  element= {
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path ="/me/update_profile"  element= {
          <ProtectedRoute>
            <UpdateUserProfile/>
          </ProtectedRoute>
        } />
         <Route path ="/me/upload_avatar"  element= {
          <ProtectedRoute>
              <UploadAvatar/>
          </ProtectedRoute>
        } />
         <Route path ="/password/update"  element= {
          <ProtectedRoute>
              <UpdatePassword/>
          </ProtectedRoute>
        } />

<Route path ="/cart"  element= {<Cart/>} />

        </Routes>
     </div>
      <Footer />
    </div>
  </Router>
  );
}

export default App;
