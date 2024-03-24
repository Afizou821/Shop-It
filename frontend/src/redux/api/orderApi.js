
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
export const orderApi= createApi({
    reducerPath:'orderApi',//在全局的redux中注册一个名为product的节点，用于存放数据
    baseQuery: fetchBaseQuery({
        baseUrl:"/api/v1"
    }),
    endpoints:(builder)=>({
       
        createNewOrder:builder.mutation({
            query(body){
                return{
                    url:'/orders/new',
                    method:'POST',
                    body
                }
            }
        }),
        stripeCheckoutSession:builder.mutation({
            
            query(body){
                console.log("hi dans oderapi");
                return{
                    url:"/payment/checkout_session",
                    method:"POST",
                    body
                }
            }
        }),
    })
})

export const {useCreateNewOrderMutation,useStripeCheckoutSessionMutation} =orderApi