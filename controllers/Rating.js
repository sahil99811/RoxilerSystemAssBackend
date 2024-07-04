const Rating=require('../models/Rating');
const Store = require('../models/Store');
const errorResponse=(res,statusCode,message)=>{
    res.status(statusCode).json({
        success:false,
        message
    })
}
exports.createRating=async (req,res)=>{
    try {
        const {id}=req.user;
        const {rating,storeId}=req.body;
        if(!rating||!storeId){
            return errorResponse(res,400,"All field are required");
        }
        const ratingObj=await Rating.create({
            user:id,
            rating,
            store:storeId
        });
        await Store.findByIdAndUpdate(storeId,{$push:{ratings:ratingObj._id}})
        return res.status(201).json({
            success:true,
            message:"Rating created Successfully"
        })
    } catch (error) {
        console.log(error);
        return errorResponse(res,500,"Server Error")
    }
}

exports.updateRating=async (req,res)=>{
    try {
        const {id}=req.user;
        const {storeId,rating}=req.body;
        if(!storeId||!rating){
            return errorResponse(res,400,"All field are required");
        }
        await Rating.findOneAndUpdate({user:id,store:storeId},{rating:rating})
        return res.status(201).json({
            success:true,
            message:"Rating updated Successfully"
        })
    } catch (error) {
        console.log(error);
        return errorResponse(res,500,"Server Error")
    }
}


