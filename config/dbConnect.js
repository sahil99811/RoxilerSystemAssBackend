const mongoose=require('mongoose');

exports.dbConnect=()=>{
    return mongoose.connect(process.env.MONGODB_URl);
}
