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