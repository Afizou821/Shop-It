import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '../layout/AdminLayout'
import { useDeleteProductImagesMutation, useGetProductDetailsQuery, useUpdloadProductImagesMutation } from '../../redux/api/productApi';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import MetaData from '../layout/MetaData';

const UploadImages = () => {
    const params=useParams();
    const fileInputref=useRef(null)
    const navigate=useNavigate();
    const [images,setImages]=useState([]);
    const [imagesPreviews,setImagesPreviews]=useState([])
    const [uploadedImages,setUploadedImages]=useState([])
    const {data}=useGetProductDetailsQuery(params?.id)
    const [updloadProductImages,{isLoading,error,isSuccess}]=useUpdloadProductImagesMutation();
    const [deleteProductImages,{isLoading:isDeleteLoading,error:deleteError,}]=useDeleteProductImagesMutation()
  //  const {data}=useUpdloadProductImagesMutation();
  useEffect( ()=>{
    if(data?.product){
        setUploadedImages(data?.product?.images);
    }
    if(error){
        toast.error(error?.data?.message)
    }
    if(isSuccess){
        setImagesPreviews([])
        toast.success("Image uploaded successfully");
        navigate("/admin/products")
    }
    if(deleteError){
        toast.error(deleteError?.data?.message)
    }
  } ,[data,error,isSuccess,deleteError]);
  const onChange=(e)=>{

    const files =Array.from(e.target.files)
    files.forEach((file)=> {
        const reader = new FileReader()
  
        reader.onload=()=>{

        if (reader.readyState === 2) {
            console.log(reader.result)
            setImagesPreviews((oldArray)=>[...oldArray,reader.result]);
            setImages((oldArray)=>[...oldArray,reader.result])
            console.log(imagesPreviews)
        };
    };
    reader.readAsDataURL(file)
    });  
  }
  const handleImagePreviewDelete=(image)=>{
    let filterImagesPreview=imagesPreviews.filter((img)=> img!==image)
    setImages(filterImagesPreview)
    setImagesPreviews(filterImagesPreview)
  }
  const handleResetFileInput=()=>{
    if(fileInputref && fileInputref.current){
        fileInputref.current.value=""
    }
  } 

  const submitHandler=(e)=>{
    e.preventDefault();
    updloadProductImages({
        id:params?.id,
        body:{images}
    })
  }
  const deleteImage=(imgId)=>{
    console.log(imgId);
    
    deleteProductImages({
        id:params?.id,
        body:{imgId}

    })
  }

  
  return (
    <AdminLayout>
    <MetaData title={"Upload Image"}/>
       <div className="row wrapper">
      <div className="col-10 col-lg-8 mt-5 mt-lg-0">
        <form className="shadow rounded bg-body" enctype="multipart/form-data" onSubmit={submitHandler}>
          <h2 className="mb-4">Upload Product Images</h2>

          <div className="mb-3">
            <label for="customFile" className="form-label">Choose Images</label>

            <div className="custom-file">
              <input
                ref={fileInputref}
                type="file"
                name="product_images"
                className="form-control"
                id="customFile"
                multiple
                onChange={onChange}
                onClick={handleResetFileInput}
              />
            </div>
            {
                imagesPreviews?.length>0 && (
                    <div className="new-images my-4">
                        <p className="text-warning">New Images:</p>
                        <div className="row mt-4">
                        {
                            
                            imagesPreviews?.map((img)=>(
                                <div className="col-md-3 mt-2">
                            <div className="card">
                                <img
                                src={img}
                                alt="Card"
                                className="card-img-top p-2"
                                style={{width: "100%", height: "80px"}}
                                />
                                <button
                                style={{backgroundColor: "#dc3545", borderColor: "#dc3545"}}
                                type="button"
                                className="btn btn-block btn-danger cross-button mt-1 py-0"
                                onClick={()=>handleImagePreviewDelete(img)}
                                >
                                <i className="fa fa-times"></i>
                                </button>
                            </div>
                            </div>
                            ))
                        }
                        
                        </div>
                        </div>
                )
            }
                        
            {
                uploadedImages?.length>0 && (
                    <div className="uploaded-images my-4">
              <p className="text-success">Product Uploaded Images:</p>
              <div className="row mt-1">
              {
                uploadedImages?.map((img)=>(
                    <div className="col-md-3 mt-2">
                  <div className="card">
                    <img
                      src={img?.url}
                      alt="Card"
                      className="card-img-top p-2"
                      style={{width: "100%", height: "80px"}}
                    />
                    <button
                      style={{backgroundColor: "#dc3545", borderColor: "#dc3545"}}
                      className="btn btn-block btn-danger cross-button mt-1 py-0"
                      disabled={isLoading ||isDeleteLoading}
                      type="button"
                      onClick={()=>deleteImage(img?.public_id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
                ))
              }
               

              </div>
            </div>
                )
            }

            
          </div>

          <button id="register_button" type="submit" className="btn w-100 py-2" disabled={isLoading ||isDeleteLoading}>
            {isLoading? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>:
                "Upload"}
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
  )
}

export default UploadImages
