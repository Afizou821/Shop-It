
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

        myOrders:builder.query({
            query:()=>"/me/orders",
        }),
        ordersDetails:builder.query({
            query:(id)=>`/orders/${id}`,
        }),
        getDashboardSale:builder.query({
            
            query:({startDate,endDate})=>`/admin/get_sales/?startDate=${startDate}&endDate=${endDate}`,
        }),
    })
})

export const {useCreateNewOrderMutation,useStripeCheckoutSessionMutation,useMyOrdersQuery,useOrdersDetailsQuery,useLazyGetDashboardSaleQuery} =orderApi