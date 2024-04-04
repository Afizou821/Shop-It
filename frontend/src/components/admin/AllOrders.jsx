
import AdminLayout from '../layout/AdminLayout'
import MetaData from '../layout/MetaData'
import React, { useEffect } from 'react'
import Loader from  '../layout/Loader'
import toast from 'react-hot-toast';
import {MDBDataTable} from 'mdbreact'
import { Link } from 'react-router-dom';
import { useAllOrdersQuery, useDeleteOrderMutation } from '../../redux/api/orderApi';


const AllOrders = () => {

    const {data,isLoading,error} =useAllOrdersQuery()
  

    const  [deleteOrders,{error:deleteError,isSuccess,isLoading:isDeleteLoading}]=useDeleteOrderMutation()
    useEffect(()=>{
       
        if(error){
            toast.error(error?.data?.message)
        }
        if(deleteError){
            toast.error(deleteError?.data?.message)
        }
        if(isSuccess){
            toast.success("Order deleted")
        }

        
    } ,[error,deleteError,isSuccess]);
    const deleteOrderHandler=(id)=>{
        deleteOrders(id)
    }

        if(isLoading) return <Loader />; 
        const setOrders=()=>{
            const orders={
                columns: [{
                    label:"ID",
                    field:"id",
                    sort: "asc"
                },
                {
                    label:"Payment Status",
                    field:"paymentStatus",
                    sort: "asc" 
                },{
                    label:"Order Status",
                    field: "orderStatus",
                    sort:"asc"
                },
               ,{
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
                    paymentStatus : element?.paymentInfo?.status,
                    orderStatus: element?.orderStatus,
                    
                    actions : <>
                        <Link to={`/admin/orders/${element?._id}`}  className='btn btn-outline-primary '>
                            <i className='fa fa-pencil'></i>
                        </Link>
                        
                        <button className='btn btn-outline-danger ms-2'
                        onClick={ () => deleteOrderHandler(element?._id)} 
                        disabled={isDeleteLoading}
                        >
                            <i className='fa fa-trash'></i>
                        </button>
                    </>
                })
            });
            return orders;
        }
  return (
    <AdminLayout>
    <MetaData title={"All Orders"} />
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
    </AdminLayout>
  )
   
  




  
}

export default AllOrders
