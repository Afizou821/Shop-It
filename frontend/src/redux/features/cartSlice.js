import { createSlice } from "@reduxjs/toolkit";


const initialState={
    //verifier s'il ya des element dans notre backstorage
   cartItems:localStorage.getItem( "cartItems") ? JSON.parse( localStorage.getItem("cartItems")) : [],
   shippingInfo:localStorage.getItem( "shippingInfo") ? JSON.parse( localStorage.getItem("shippingInfo")) : {},
}

export const cartSlice = createSlice({
    initialState,
    name:"cartSlice",
    reducers:{
       setCartItem:(state,action)=>{
            const item=action.payload;
            //verifier si l'item existe dans le tableau
            const isItemExist=state.cartItems.find(
                (i) => i.product=== item.product
            );
            //s'il existe mettre ajour
            if(isItemExist){
                state.cartItems=state.cartItems.map((i)=> 
                    i.product === isItemExist.product ? item : i
                )
            }else{
                state.cartItems=[...state.cartItems,item]
            }
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems))
           

       },
       removeCartItem:(state, action)=>{

        state.cartItems=state?.cartItems?.filter(
            (i) => i.product !== action.payload
        );
        localStorage.setItem("cartItems",JSON.stringify(state.cartItems))
       },
       saveShippingInfo:(state, action)=>{

        state.shippingInfo=action.payload
        console.log(state.shippingInfo)
        localStorage.setItem("shippingInfo",JSON.stringify(state.shippingInfo))
       },


    }
})

export default cartSlice.reducer;

export const {setCartItem,removeCartItem,saveShippingInfo}=cartSlice.actions;