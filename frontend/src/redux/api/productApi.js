
import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
export const productApi= createApi({
    reducerPath:'product',//在全局的redux中注册一个名为product的节点，用于存放数据
    baseQuery: fetchBaseQuery({
        baseUrl:"/api/v1"
    }),
    tagTypes:["Product","AdminProducts"],
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
        getAdminProducts:builder.query({
           
            query:()=>`/admin/products`,
           providesTags:["AdminProducts"]
        }),
        createProduct: builder.mutation({
            //这里是提交评
            query(body) {
                return {
                    method: 'POST',
                    url: `/admin/products`,
                    body
                }
            },
            invalidatesTags: ['AdminProducts'],
            
        }),
        updateProduct: builder.mutation({
            //这里是提交评
            query({id,body}) {
                return {
                    method: 'PUT',
                    url: `/admin/products/${id}`,
                    body
                }
            },
            invalidatesTags: ["Product","AdminProducts"],
            
        }),
        updloadProductImages: builder.mutation({
            //这里是提交评
            query({id,body}) {
                return {
                    method: 'PUT',
                    url: `/admin/products/${id}/upload_images`,
                    body
                }
            },
            invalidatesTags: ["Product"],
            
        }),
        deleteProductImages: builder.mutation({
            //这里是提交评
            query({id,body}) {
                return {
                    method: 'PUT',
                    url: `/admin/products/${id}/delete_images`,
                    body
                }
            },
            invalidatesTags: ["Product"],
            
        }),
        deleteProduct: builder.mutation({
            //这里是提交评
            query(id) {
                return {
                    method: 'DELETE',
                    url: `/admin/products/${id}`,
                    
                }
            },
            invalidatesTags: ["AdminProducts"],
            
        }),
    })
})

export const {useGetProductsQuery,
    useGetProductDetailsQuery,
    useSubmitReviewsMutation,
    useCanUserReviewQuery,
    useGetAdminProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUpdloadProductImagesMutation,
    useDeleteProductImagesMutation,
    useDeleteProductMutation
} =productApi