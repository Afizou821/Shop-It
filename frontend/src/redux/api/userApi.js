import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { setIsAuthenticated ,setUser,setLoading} from '../features/userSlice';
export const userApi= createApi({
    reducerPath:'userApi',//在全局的redux中注册一个名为product的节点，用于存放数据
    baseQuery: fetchBaseQuery({
        baseUrl:"/api/v1"
    }),
    tagTypes:["User"],
    endpoints:(builder)=>({
       getMe :builder.query({
           
            query:()=>`/me`,
            transformResponse:(result)=>result.user,
            async  onQueryStarted(arg,{dispatch,queryFulfilled}){
                try{
                       const {data}= await  queryFulfilled;
                       dispatch(setUser(data))
                       dispatch(setIsAuthenticated(true))
                       dispatch(setLoading(false))

                }catch(error){
                    dispatch(setLoading(false))
                        console.log(error)
                }
            },
            providesTags:["User"],
   
        }),
        updateProfile:builder.mutation({
            query(body){
                return {
                    url:"/me/update",
                    method:"PUT" ,
                    body,
                }
            },
            invalidatesTags:[ "User"]
        }),
        uploadAvatar:builder.mutation({
            query(body){
                return {
                    url:"/me/upload_avatar",
                    method:"PUT" ,
                    body,
                }
            },
            invalidatesTags:["User"]
        }),
        updatePassword:builder.mutation({
            query(body){
                return {
                    url:"/password/update",
                    method:"PUT" ,
                    body,
                }
            },
            
        }),
        forgotPassword:builder.mutation({
            query(body){
                return {
                    url:"/password/forgot",
                    method:"POST" ,
                    body,
                }
            },
            
        }),
        resetPassword:builder.mutation({
            query(token,body){
                return {
                    url:`/password/reset/${token}`,
                    method:"PUT" ,
                    body,
                }
            },
            
        })
        
    })
        
        
    })

export const {useGetMeQuery,useUpdateProfileMutation,useUploadAvatarMutation,useUpdatePasswordMutation,useForgotPasswordMutation,useResetPasswordMutation} = userApi;