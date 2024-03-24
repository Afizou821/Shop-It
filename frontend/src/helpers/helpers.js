

export const getPriceQueryParams=(searchParams,key,value) =>{
    const hasValueInParams=searchParams.has(key);
    if (hasValueInParams && value){
        searchParams.set(key,value);
        }else if(value) {
            searchParams.append(key,value);
        }else if(hasValueInParams){
            searchParams.delete(key);
            }
     return searchParams; 


};  
export const calculateOrderCost=(cartItems)=>{
    const itemsPrice= cartItems?.reduce(
        (acc,item)=>acc+item.price*item.quantity,0)
    
        const ShippingPrice =itemsPrice>200? 0:25;
        const taxPrice=Number((0.15*itemsPrice).toFixed(2));
        
        const totalCost= (itemsPrice + taxPrice + ShippingPrice).toFixed(2) ;
        return {
            totalCost,
            itemsPrice,
            taxPrice,
            ShippingPrice};
}