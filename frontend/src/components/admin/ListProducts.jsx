import React, { useEffect } from 'react'

import Loader from  '../layout/Loader'
import toast from 'react-hot-toast';
import AdminLayout from '../layout/AdminLayout';
import {MDBDataTable} from 'mdbreact'
import { Link } from 'react-router-dom';
import MetaData from '../layout/MetaData';

import { useDeleteProductMutation, useGetAdminProductsQuery } from '../../redux/api/productApi';
const ListProducts = () => {
    const {data,isLoading,error} =useGetAdminProductsQuery();
    const[deleteProduct,{isLoading:deleteLoading,error:deleteError,success}] =useDeleteProductMutation();

    const deleteProductHandler=(id)=>{
        deleteProduct(id)
    }

    useEffect(()=>{
       
        if(error){
            toast.error(error?.data?.message)
        }
        if(deleteError){
            toast.error(deleteError?.data?.message)
        }
        if(success){
            toast.success('Product Deleted')
        }

        
    } ,[error,deleteError,success]);

        if(isLoading) return <Loader />; 
        const setProducts=()=>{
            const products={
                columns: [{
                    label:"ID",
                    field:"id",
                    sort: "asc"
                },
                {
                    label:"Name",
                    field:"name",
                    sort: "asc" 
                },{
                    label:"Stock",
                    field: "stock",
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
            data?.products?.forEach((element )=> {
                products.rows.push({
                    id : element?._id,
                    name : ` ${element?.name?.substring(0,20)}....`,
                    stock : element?.stock,
                    
                    actions : <>
                        <Link to={`/admin/products/${element?._id}`}  className='btn btn-outline-primary '>
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <Link to={`/admin/products/${element?._id}/upload_images`}  className='btn btn-outline-success ms-2'>
                            <i className='fa fa-image'></i>
                        </Link>
                        <button onClick={()=>deleteProductHandler(element?._id)} disabled={deleteLoading} className='btn btn-outline-danger ms-2'>
                            <i className='fa fa-trash'></i>
                        </button>
                    </>
                })
            });
            return products;
        }
  return (
    <AdminLayout>
    <MetaData title={"All Products"} />
    <div>
     <h1 className='my-5'>{data?.products?.length} Products</h1>
     <MDBDataTable 
        data={setProducts()}
        className='px-4'
        bordered
        striped
        hover
     />
     
    </div>
    </AdminLayout>
  )
   
  




  
}

export default ListProducts
