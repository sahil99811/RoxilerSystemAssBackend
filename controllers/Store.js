const Store=require('../models/Store');
const Rating=require('../models/Rating');
const User=require('../models/User')
const errorResponse=(res,statusCode,message)=>{
    res.status(statusCode).json({
        success:false,
        message
    })
}
exports.createStore=async(req,res)=>{
    try {
        const {name,email,address,rating}=req.body;
        if(!name||!email||!address||!rating){
            return errorResponse(res,400,"All field are required");
        }
        const newstore=await Store.create({name,email,address,rating});
        await User.findOneAndUpdate({email:email},{store:newstore._id})
        return res.status(201).json({
            success:true,
            message:"Store Created Successfully"
        })
    } catch (error) {
        console.log(error);
        return errorResponse(res,500,"Server Error")
    }
}

exports.storesAnalytics = async (req, res) => {
    try {
      const [totalUser, totalStores, totalRating] = await Promise.all([
        User.find({}).countDocuments(),
        Store.find({}).countDocuments(),
        Rating.find({}).countDocuments(),
      ]);
  
      // Send the analytics data as a response
      res.status(201).json({
        success: true,
        data: {
          totalUser,
          totalStores,
          totalRating,
        },
      });
    } catch (error) {
      // Log the error (optional)
      console.error('Error fetching analytics data:', error);
  
      // Send an error response
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching analytics data',
        error: error.message, // Optionally include the error message
      });
    }
  };
  

exports.getAllStores=async (req,res)=>{
  try{
    let { name, email, address, sortbyname, sortbyaddress } = req.query;
    const query = {};

    // Build the query object based on provided parameters
    if (name) {
      query.name = new RegExp(name, 'i'); // Case-insensitive search for name
    }
    if (email) {
      query.email = new RegExp(email, 'i'); // Case-insensitive search for email
    }
    if (address) {
      query.address = new RegExp(address, 'i'); // Case-insensitive search for address
    }
    

    // Build sort object based on provided parameters
    const sort = {};
    if (sortbyname) {
      sort.name = sortbyname === 'asc' ? 1 : -1;
    }
    if (sortbyaddress) {
      sort.address = sortbyaddress === 'asc' ? 1 : -1;
    }

    const result = await Store.find(query)
                              .select('_id name email address rating ratings')  // 'rating' added to the select fields
                              .populate({
                                          path: 'ratings',
                                          select: '_id user rating',
                                          populate: {
                                                    path: 'user',
                                                    select: 'name email'  
                                                    }
                                        })
                              .sort(sort);

    res.status(200).json({
      success: true,
      data: result
    });
  }catch(error){
    // Log the error (optional)
    console.error('Error fetching analytics data:', error);
  
    // Send an error response
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching analytics data',
      error: error.message, // Optionally include the error message
    });
  }
}

exports.getStoreRatings = async (req, res) => {
  try {
      const { id } = req.user; // Assuming req.user contains authenticated user's info
    
      // Fetch the user by ID
      const user = await User.findById(id);

      // Populate the store's ratings along with the user details who gave the ratings
      const ratings= await Rating.find({store:user.store}).select("user rating").populate({
        path:"user",
        select:"name address"
      })
      
      return res.status(200).json({
          success: true,
          message: "All ratings fetched successfully",
          ratings,
          
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message
      });
  }
};