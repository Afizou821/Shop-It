
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
export const productApi= createApi({
    reducerPath:'product',//在全局的redux中注册一个名为product的节点，用于存放数据
    baseQuery: fetchBaseQuery({
        baseUrl:"/api/v1"
    }),
    tagTypes:["Product"],
    endpoints:(builder)=>({
        getProducts:builder.query({
            query:(params)=>({
                url:'/products',
                params:{
                    page:params?.page,
                    keyword:params?.keyword,
                    category:params?.category,
                    "price[gte]":params.min,
                    "price[lte]":params.max,
                    "ratings[gte]":params?.ratings,

                }

            }),
        }),
        getProductDetails:builder.query({
            query:(id)=>`/products/${id}`,
            providesTags:['Product']
        }),
        submitReviews: builder.mutation({
            //这里是提交评
            query(body) {
                return {
                    method: 'PUT',
                    url: `/reviews`,
                    body
                }
            },
            invalidatesTags:['Product']
        }),
        canUserReview:builder.query({
           
            query:(productId)=>`/can_review/?productId=${productId}`,
            providesTags:['Product']
        }),
    })
})

export const {useGetProductsQuery,useGetProductDetailsQuery,useSubmitReviewsMutation,useCanUserReviewQuery} =productApi