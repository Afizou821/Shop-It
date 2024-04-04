
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
export const orderApi= createApi({
    reducerPath:'orderApi',//在全局的redux中注册一个名为product的节点，用于存放数据
    baseQuery: fetchBaseQuery({
        baseUrl:"/api/v1"
    }),
    tagTypes:["Order","AdminOrders"],
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
            providesTags:["Order"]
        }),
        getDashboardSale:builder.query({
            
            query:({startDate,endDate})=>`/admin/get_sales/?startDate=${startDate}&endDate=${endDate}`,
        }),
        allOrders:builder.query({
            query:()=>"/admin/orders",
            providesTags:["AdminOrders","Order"]
        }),
        updateOrder:builder.mutation({
            query({id,body}){
                return {
                    url:`/admin/orders/${id}`,
                    method: 'PUT',
                    body 
                }
            },
            invalidatesTags:["Order"]
        }),
        deleteOrder:builder.mutation({
            query(id){
                return {
                    url:`/admin/orders/${id}`,
                    method: 'DELETE',
                   
                }
            },
            invalidatesTags:["AdminOrders"],
        }),
    })
})

export const {useCreateNewOrderMutation,
    useStripeCheckoutSessionMutation,
    useMyOrdersQuery,
    useOrdersDetailsQuery,
    useLazyGetDashboardSaleQuery,
    useAllOrdersQuery,
    useUpdateOrderMutation,
    useDeleteOrderMutation

} =orderApi