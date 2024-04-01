import React, { useEffect } from 'react'
import { useMyOrdersQuery } from '../../redux/api/orderApi'
import Loader from  '../layout/Loader'
import toast from 'react-hot-toast';
import {MDBDataTable} from 'mdbreact'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import { clearCart } from '../../redux/features/cartSlice';
import { useDispatch } from 'react-redux';

const MyOrders = () => {
    const {data,isLoading,error} =useMyOrdersQuery();
    const [searchParams]=useSearchParams()
    const orderSuccess=searchParams.get("order_success");
    const dispatch =useDispatch()
    const navigate=useNavigate()

    useEffect(()=>{
       
        if(error){
            toast.error(error?.data?.message)
        }
        if(orderSuccess){
           dispatch( clearCart());
           navigate("/me/orders");
           
        }
    } ,[error,orderSuccess]);

        if(isLoading) return <Loader />; 
        const setOrders=()=>{
            const orders={
                columns: [{
                    label:"ID",
                    field:"id",
                    sort: "asc"
                },
                {
                    label:"Amount Paid",
                    field:"amount",
                    sort: "asc" 
                },{
                    label:"payment status",
                    field: "status",
                    sort:"asc"
                },
                {
                    label:"Order Status",
                    field:"orderStatus",
                    sort: "asc"
                },{
                    label:"Actions",
                    field:"actions",
                    sort: "asc"
                }
                   

                ],
                rows:[],
            };
            data?.orders?.forEach((element )=> {
                orders.rows.push({
                    id : element?._id,
                    amount : `$ ${element.totalAmount}`,
                    status : element?.paymentInfo?.status?.toUpperCase(),
                    orderStatus : element?.orderStatus,
                    actions : <>
                        <Link to={`/me/orders/${element?._id}`}  className='btn btn-primary'>
                            <i className='fa fa-eye'></i>
                        </Link>
                        <Link to={`/invoice/orders/${element._id}`}  className='btn btn-success ms-2'>
                            <i className='fa fa-print'></i>
                        </Link>
                    </>
                })
            });
            return orders;
        }
  return (
    <>
    <MetaData title={"Order Details"} />
    <div>
     <h1 className='my-5'>{data?.orders?.length} Orders</h1>
     <MDBDataTable 
        data={setOrders()}
        className='px-4'
        bordered
        striped
        hover
     />
     
    </div>
    </>
  )
}

export default MyOrders
