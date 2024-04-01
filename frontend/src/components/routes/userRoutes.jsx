import React from 'react'
import {Route} from "react-router-dom";
import Productdetails from "../product/Productdetails.jsx";
import Register from "../auth/Register.jsx";
import Profile from "../user/Profile.jsx";
import UpdateUserProfile from "../user/UpdateUserProfile.jsx";
import ProtectedRoute from "../auth/ProtectedRoute.jsx";
import UploadAvatar from "../user/UploadAvatar.jsx";
import UpdatePassword from "../user/UpdatePassword.jsx";
import ForgotPassword from "../auth/ForgotPassword.jsx";
import ResetPassword from "../auth/ResetPassword.jsx";
import Cart from "../Cart/Cart.jsx";
import Shipping from "../Cart/Shipping.jsx";
import ConfrmOrder from "../Cart/ConfrmOrder.jsx";
import PayementMethod from "../Cart/PayementMethod.jsx";
import MyOrders from "../order/MyOrders.jsx";
import OrderDetails from "../order/OrderDetails.jsx";
import Invoice from "../invoice/Invoice.jsx";
import Home from "../Home.jsx";
import Login from "../auth/Login.jsx";   
const userRoutes = () => {
    
  return (
    <>
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
        <Route path ="/me/orders/:id"  element= {
          <ProtectedRoute>
              <OrderDetails/>
          </ProtectedRoute>
        } />

        <Route path ="/cart"  element= {<Cart/>} />
        <Route path ="/shipping"  element= {
          <ProtectedRoute> 
            <Shipping />
          </ProtectedRoute>
        } />
        <Route path ="/confirm_order"  element= {
          <ProtectedRoute> 
            <ConfrmOrder />
          </ProtectedRoute>
        } />
        <Route path ="/payment_method"  element= {
          <ProtectedRoute> 
            <PayementMethod />
          </ProtectedRoute>
        } />
        <Route path ="/me/orders"  element= {
          <ProtectedRoute> 
            <MyOrders />
          </ProtectedRoute>
        } />
        <Route path ="/invoice/orders/:id"  element= {
          <ProtectedRoute> 
            <Invoice />
          </ProtectedRoute>
        } />

        
    </>
  )
}

export default userRoutes
