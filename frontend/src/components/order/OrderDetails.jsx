import React, { useEffect } from 'react'
import MetaData from '../layout/MetaData'
import { useOrdersDetailsQuery } from '../../redux/api/orderApi'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loader from '../layout/Loader'

const OrderDetails = () => {
    const params=useParams()
    const {data,isLoading, error}=useOrdersDetailsQuery(params?.id);

    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message)
        }
    },[error]);
    if(isLoading) return <Loader />
    
   const paid= data?.order?.paymentInfo?.status==="paid" ? true:false;
   
  return (
    <>
        <MetaData title={"Order Details"} />
    
    <div className="row d-flex justify-content-center">
      <div className="col-12 col-lg-9 mt-5 order-details">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mt-5 mb-4">Your Order Details</h3>
          <Link className="btn btn-success" to={`/invoice/orders/${data?.order?._id}`}>
            <i className="fa fa-print"></i> Invoice
          </Link>
        </div>
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th scope="row">ID</th>
              <td>{data?.order?._id}</td>
            </tr>
            <tr>
              <th scope="row">Status</th>
              <td className={
                String(data?.order?.orderStatus).includes("Delivered")? "greenColor":"redColor"}>
                <b>{data?.order?.orderStatus}</b>
              </td>
            </tr>
            <tr>
              <th scope="row">Date</th>
              <td>{new Date(data?.order?.createdAt).toLocaleDateString("en-US")}</td>
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
              <td>{data?.order?.shippingInfo?.address}, {data?.order?.shippingInfo?.city}, {data?.order?.shippingInfo?.zipCode},{data?.order?.shippingInfo?.country}</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 mb-4">Payment Info</h3>
        <table className="table table-striped table-bordered">
          <tbody>
            <tr>
              <th scope="row">Status</th>
              <td className= {paid ? "greenColor":"redColor"}>
                <b>{data?.order?.paymentInfo?.status}</b>
              </td>
            </tr>
            <tr>
              <th scope="row">Method</th>
              <td>{data?.order?.paymentMethod}</td>
            </tr>
            <tr>
              <th scope="row">Stripe ID</th>
              <td>{data?.order?.paymentInfo?.id || "Null"}</td>
            </tr>
            <tr>
              <th scope="row">Amount Paid</th>
              <td>${data?.order?.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 my-4">Order Items:</h3>
        {data?.order?.orderItems.map((item)=>{
            return (
                <>
                <hr />
        <div className="cart-item my-1">
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
              <Link to={`/product/${item?.product}`}>{item?.name}</Link>
            </div>

            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
              <p>${item?.price}</p>
            </div>

            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
              <p>{item?.quantity} Piece(s)</p>
            </div>
          </div>

        </div>
        <hr />
                </>
            )
        }
            
        )}

        
      </div>
    </div>
    </>
  )
}

export default OrderDetails
