import React, { useEffect, useState } from 'react'
import MetaData from '../layout/MetaData'
import CheckOutSteps from './CheckOutSteps'
import { useDispatch, useSelector } from 'react-redux';
import { calculateOrderCost } from '../../helpers/helpers';
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PayementMethod = () => {
    const [method,setMethod]=useState("");
    const [createNewOrder,{error,isSuccess}] = useCreateNewOrderMutation();
    const [stripeCheckoutSession,{data:checkoutData,error:checkoutError,isLoading}]=useStripeCheckoutSessionMutation()
    const {shippingInfo,cartItems}=useSelector(state=>state.cart);
    const navigate =useNavigate();
    const dispatch=useDispatch();
    const {
        totalCost,
        itemsPrice,
        taxPrice,
        ShippingPrice}=calculateOrderCost(cartItems);
    const submitHandler=(e)=>{
        e.preventDefault();

       // tester les methode de payement choisie
       if(method==="COD"){
        const orderData={
            shippingInfo:shippingInfo,
            orderItems:cartItems,
            totalAmount:totalCost,
            itemsPrice: itemsPrice,
            taxAmount:taxPrice,
            shippingAmount: ShippingPrice,
            paymentInfo:{
                status:"Not Paid"
            },
            paymentMethod:"COD"
        }
        createNewOrder(orderData)
       }
       if (method==="Card") {
        const orderData={
          shippingInfo:shippingInfo,
          orderItems:cartItems,
          totalAmount:totalCost,
          itemsPrice: itemsPrice,
          taxAmount:taxPrice,
          shippingAmount: ShippingPrice,
          
        };
        stripeCheckoutSession(orderData);
       }

    }
    useEffect(()=>{
      if(checkoutData){
          window.location.href=checkoutData?.url;
          
      }
      if(checkoutError){
        toast.error(checkoutError?.data?.message)
      }
    },[checkoutData,checkoutError]);

    useEffect(()=>{
        if(error){
            toast.error(
                error?.data?.message
            ) ;     
         }
         if(isSuccess){
            navigate("/me/orders?order_success=true");
         }
    } ,[isSuccess,error])
  return (
    <>
      <MetaData title={'Payment Method'} />
      <CheckOutSteps shipping payement confirmOrder />
      <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Select Payment Method</h2>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="codradio"
              value="COD"
              onChange={(e) => setMethod("COD")}

            />
            <label className="form-check-label" for="codradio">
              Cash on Delivery
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="cardradio"
              value="Card"
              onChange={(e) => setMethod("Card")}
            />
            <label className="form-check-label" for="cardradio">
              Card - VISA, MasterCard
            </label>
          </div>

          <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
            CONTINUE
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default PayementMethod
