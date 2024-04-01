import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import order from "../models/order.js";
import product from "../models/product.js";
import Product from "../models/product.js"
import APIFilters from "../utils/apiFilter.js";
import ErrorHandler from "../utils/errorHandler.js";
//create a product => /api/v1/products
// export const getProducts= catchAsyncErrors( async(req, res)=>{
//     const products = await Product.find();
//     res.status(200).json({
//        products,
//     })
// });

export const getProducts= catchAsyncErrors( async(req, res,next)=>{
    const resPerPage= 4
    const apifilters= new APIFilters(Product,req.query).search().filters();
    
    
    let products= await apifilters.query;
    let filteredProductscount=products.length;

    

    apifilters.pagination(resPerPage);
    products=await apifilters.query.clone();
    res.status(200).json({
        resPerPage,
        filteredProductscount,
       products,
    })
});


//create a product => /api/v1/admin/products
export const newProduct=catchAsyncErrors( async(req, res)=>{
   
    req.body.user=req.user._id;
    const product =await Product.create(req.body);

    res.status(200).json({
        product,
    })
});

//get single products =>/api/v1/products/:id
export const getProductDetails= catchAsyncErrors( async(req, res,next)=>{
   
    const product =await Product.findById(req?.params?.id).populate('reviews.user');

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        product,
    })
});


//update single products =>/api/v1/admin/products/:id
export const updateProduct=catchAsyncErrors( async(req, res)=>{
   
    let product =await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("No product found with that ID",404));
        
    }
    product= await Product.findByIdAndUpdate(req?.params?.id,req.body,{new:true})
    res.status(200).json({
        product,
    })
});
//delete product 
export const deleteProduct= catchAsyncErrors( async(req,res)=> {
    let product =await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("No product found with that ID",404));

    }
    product.deleteOne();
    res.status(200).json({
        message:"Product deleted"
    })
});

//create a product review ==>/api/v1/reviens
export const createProductReview= catchAsyncErrors( async(req,res)=> {

    const{rating, comment , productId}= req.body;
    const review ={
        user: req?.user?._id,
        rating:Number(rating),
        comment,
    }
    
    let product =await Product.findById(productId);

    if(!product){
        return next(new ErrorHandler("No product found with that ID",404));

    }
    const isReviewed= product?.reviews?.find(
        (r)=> r.user.toString()===req.user?._id.toString()
    );
    
    if (isReviewed) {
       
        if(review?.user?.toString()===req?.user?._id.toString()){
            isReviewed.comment=comment,
            isReviewed.rating=rating     
            
        }
    } else {
      product.reviews.push(review) ;
      product.numOfreviews =product.reviews.length;
    }

    product.ratings=product.reviews.reduce((acc,item)=> item.rating+acc,0)/product.reviews.length;

    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    })
});

//get all reviews from current product /api/v1/getAllReview
export const getAllReview= catchAsyncErrors( async(req,res)=> {
    
    let product =await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("No product found with that ID",404));
    }
    const reviews=product.reviews;
    
    res.status(200).json({
        reviews,
    })
});

//delete all reviews from current product /api/v1/admin/getAllReview
export const deleteProductReview= catchAsyncErrors( async(req,res)=> {

   
    
    let product =await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("No product found with that ID",404));

    }
    product.reviews= product?.reviews?.filter(
        (review)=> review._id.toString() !==req.query?.id.toString()
    );
    
    product.numOfreviews=product.reviews.length
    if(product.reviews.length===0){
        product.ratings=0;
    }else{
    product.ratings=product.reviews.reduce((acc,item)=> item.rating+acc,0)/product.reviews.length;
    }
    
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    })
});

//can user review =>/api/v1/can_review
export const canUserReview=catchAsyncErrors( async(req, res)=>{
    
    const orders= await  order.find({
        user: req.user._id , 
       "orderItems.product":req.query.productId});
        
       if (orders.length===0) {
            return res.status(200).json({ canReviewed:false})
       }
    res.status(200).json({
        canReviewed:true,
    })
});