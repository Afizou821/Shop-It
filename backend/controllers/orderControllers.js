import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import ErrorHandler from "../utils/errorHandler.js";

//create new order =< /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,

    }=req.body;

    const order =await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id,
    });
    order?.orderItems?.forEach(async (item)=>{
        // reduce quantity of product
        const product =await Product.findById(item?.product?.toString());
        if(!product){
            return next(new ErrorHandler('Product not found with this ID',404));
        }
        product.stock =product.stock-item.quantity;
        await product.save({validateBeforeSave:false});
    })

    res.status(200).json({
        order,
    })
});

//get Currentuser order details => /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res) => {
    console.log(" hi there")
    console.log(req.user._id);
    const orders = await Order.find({user:req.user._id});


    if(!orders){
        return  new ErrorHandler('No Order Found with this ID',404);

    }

    res.status(200).json({
        orders,
    });
});
//get order details /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res) => {

    const order = await Order.findById(req.params.id).populate("user" ,"email name");


    if(!order){
        return  new ErrorHandler('No Order Found with this ID',404);

    }

    res.status(200).json({
        order,
    });
});

//get all orders => /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res) => {
    const orders = await Order.find();
    res.status(200).json({
        orders,
    });
});

//update orders => /api/v1/admin/orders
export const updateOrders = catchAsyncErrors(async (req, res,next) => {
    
    const order = await Order.findById(req?.params?.id);
    
    if(!order){
        return next(new ErrorHandler('Order not found this ID',404));
    }
    if(order?.orderStatus==="Delivered"){
        return next(new ErrorHandler(`Cannot Update a Delivered Order`,400));
    }

    // order?.orderItems?.forEach(async (item)=>{
    //     // reduce quantity of product
    //     const product =await Product.findById(item?.product?.toString());
    //     if(!product){
    //         return next(new ErrorHandler('Product not found with this ID',404));
    //     }
    //     product.stock =product.stock-item.quantity;
    //     await product.save({validateBeforeSave:false});
    // })
    order.orderStatus=req.body.status;
    order.deliveredAt=Date.now();
    await order.save();

    res.status(200).json({
      success:true,
    });
});


//delete order => api/v1/admin/orders/:id

export const deleteOrders = catchAsyncErrors(async (req, res,next) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
        return next(new ErrorHandler("This Order is not exist", 404));
        }
        //reduce the stock from the deleted products
        order?.orderItems?.forEach(async (item)=>{
            const product =await Product.findById(item?.product?.toString());
            if(!product){
                return next(new ErrorHandler('Product not found with this ID',404));
            }
            product.stock =product.stock+item.quantity;
            await product.save({validateBeforeSave:false});
        });

        await order.deleteOne();
        res.status(200).json({
            success: true,
        });

})
//getSalesData
async function getSalesData(startDate,endDate){
    
    const salesData = await Order.aggregate([
        {
            //etape 1:filtrer les resultat
            $match:{
                createdAt:{
                    $gte:new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            //etape 2:grouper les donnée
            $group:{
                _id:{
                    date:{
                      $dateToString:{
                       format:"%Y-%m-%d" ,
                       date: "$createdAt"
                      }  
                    }
                },
                totalSales:{
                  $sum : '$totalAmount'
                },
                numOrder:{
                    $sum:1
                }
            }
        }
    ]);

    //create a map to store data and num of order by data
    const salesMap=new Map()
    let totalSales=0
    let totalNumOrders=0
    salesData.forEach((entry)=>{
        const date=entry._id.date;
        const sales=entry.totalSales;
        const numOrders=entry.numOrder;

        salesMap.set(
            date,
            {sales,numOrders}
        )
        totalSales+=sales;
        totalNumOrders=numOrders;
        

    });
    //generate an array of date between start and end date
    const datesBetween=getDateBetween(startDate,endDate)
    //create final sales data array with 0 for dates without sales
    const finalSalesData=datesBetween.map((date)=> ({
        date,
        sales:(salesMap.get(date) || {sales:0}).sales,
        numOfOrders:(salesMap.get(date)||{numOrders:0}).numOrders
    }));
    
    return {salesData:finalSalesData,totalSales,totalNumOrders};

}
function getDateBetween(startDate,endDate){
    const dates=[];
    let currentDate= new Date(startDate )

    while(currentDate<= new Date(endDate)){
        const formattedDate=currentDate.toISOString().split("T")[0]
        dates.push(formattedDate)
        currentDate.setDate(currentDate.getDate()+1)

        
    }
    console.log(dates)
    return dates;

}
//let sales Data => /api/v1/admin/get_sales
export const getSales= catchAsyncErrors(async (req, res,next) => {

   const startDate=new Date( req.query.startDate );
   const endDate= new Date( req.query.endDate );

   startDate.setUTCHours(0,0 ,0,0);
   endDate.setUTCHours(23,59 ,59,999);
   console.log(startDate,endDate)
  const {salesData, totalSales,totalNumOrders}=await getSalesData(startDate,endDate) 
 
        res.status(200).json({
            totalSales,
            totalNumOrders,
            sales:salesData, 
        });

})