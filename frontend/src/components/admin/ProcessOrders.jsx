import AdminLayout from '../layout/AdminLayout'
import MetaData from '../layout/MetaData'
import React, { useEffect, useState } from 'react'
import Loader from  '../layout/Loader'
import toast from 'react-hot-toast';
import {MDBDataTable} from 'mdbreact'
import { Link, useParams } from 'react-router-dom';
import { useOrdersDetailsQuery, useUpdateOrderMutation } from '../../redux/api/orderApi';
const ProcessOrders = () => {
    const params= useParams()
    console.log(params.id);
    const {data,error,isSuccess} =useOrdersDetailsQuery(params.id);
    const [updateOrder,{isLoading,error:updateError,isSuccess:updateSuccess}]=useUpdateOrderMutation()
    const [status,setStatus]=useState("")
    useEffect(()=>{
        if(data?.order?.orderStatus){
            setStatus(data?.order?.orderStatus)
        }
    },[data?.order?.orderStatus])
   useEffect(()=>{
    
    if(error){
        toast.error(error?.data?.message)
    }
    if(updateError){
        toast.error(updateError?.data?.message)
    }
    if(updateSuccess){
        toast.success("Order Updated Successfully")}
   },[error,updateSuccess,updateError])

   const updateOrderHandler  =(id)=>{
   const data ={status}
    updateOrder({
        id,
        body:data
    })
   }

  return (
    <AdminLayout>
    <MetaData title={"Process Orders | Admin"} />
    <div className="row d-flex justify-content-around">
      <div className="col-12 col-lg-8 order-details">
        <h3 className="mt-5 mb-4">Order Details</h3>

        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th scope="row">ID</th>
              <td>{data?.order?._id}</td>
            </tr>
            <tr>
              <th scope="row">Order Status</th>
              <td className={String(data?.order?.orderStatus).includes("Delivered") ? "greenColor":"redColor"}>
                <b>{data?.order?.orderStatus}</b>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 mb-4">Shipping Info</h3>
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th scope="row">Name</th>
              <td>{data?.order?.user?.name}</td>
            </tr>
            <tr>
              <th scope="row">Phone No</th>
              <td>{data?.order?.shippingInfo?.phoneNo}</td>
            </tr>
            <tr>
              <th scope="row">Address</th>
              <td>{data?.order?.shippingInfo?.address},{data?.order?.shippingInfo?.city},{data?.order?.shippingInfo?.zipCode},{data?.order?.shippingInfo?.country}</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 mb-4">Payment Info</h3>
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th scope="row">Status</th>
              <td className="greenColor">
                <b>{data?.order?.paymentInfo?.status}</b>
              </td>
            </tr>
            <tr>
              <th scope="row">Method</th>
              <td>{data?.order?.paymentMethod}</td>
            </tr>
            <tr>
              <th scope="row">Stripe ID</th>
              <td>{data?.order?.paymentInfo?.id ||"null"}</td>
            </tr>
            <tr>
              <th scope="row">Amount</th>
              <td>${data?.order?.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 my-4">Order Items:</h3>
        <hr />
        <div className="cart-item my-1">
        {
            data?.order?.orderItems?.map((item)=>(
               
              
          <div className="row my-5">
            <div className="col-4 col-lg-2">
              <img
                src={item?.image}
                alt={item?.name}
                height="45"
                width="65"
              />
            </div>
            <div className="col-5 col-lg-5">
              <Link to={`/products/${item?.product}`}>{item?.name}</Link>
            </div>
            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
              <p>${item?.price}</p>
            </div>
            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
              <p>{item?.quantity} Piece(s)</p>
            </div>
          </div>
        
        
            ))
        }
        </div>
        <hr />
        
      </div>

      <div className="col-12 col-lg-3 mt-5">
        <h4 className="my-4">Status</h4>

        <div className="mb-3">
          <select className="form-select" name="status" value={status }  onChange={(e)=>setStatus(e.target.value)}> 
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <button className="btn btn-primary w-100" onClick={ ()=> updateOrderHandler (data?.order?._id)}>Update Status</button>

        <h4 className="mt-5 mb-3">Order Invoice</h4>
        <Link to={`/invoice/orders/${data?.order?._id}`} className="btn btn-success w-100">
          <i className="fa fa-print"></i> Generate Invoice
        </Link>
      </div>
    </div>
    </AdminLayout>
  )
}

export default ProcessOrders

