const User=require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const errorResponse=(res,statusCode,message)=>{
    res.status(statusCode).json({
        success:false,
        message
    })
}
const generateToken=(user)=>{
   return jwt.sign({id:user._id.toString(),role:user.role},process.env.JWT_SECRET,{expiresIn:"24hr"})
}

exports.signup=async (req,res)=>{
  try{
    console.log("api called");
    const {name,email,address,password,role}=req.body;
    if(!name||!email||!password||!address){
        return errorResponse(res,400,"All field are required");
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
       return errorResponse(res, 409, "User already exists"); 
    }
    const hashedPassword=await bcrypt.hash(password,10);
    await User.create({
        name:name,
        email:email.toLowerCase(),
        password:hashedPassword,
        address,
        role
    })
    return res.status(201).json({
        success:true,
        message:"Signup Successfully"
    })
  }catch(error){
    console.log(error);
    return errorResponse(res,500,"Server Error")
  }
}

exports.login=async (req,res)=>{
    try{
      const {email,password}=req.body;
      console.log("api called")
      if(!email||!password){
        return errorResponse(res,400,"All field are required");
      }
      const user=await User.findOne({email:email.toLowerCase()});
      if(!user){
        return errorResponse(res,404,"User is Not registered");
      }
      // user.password = undefined;
      const passwordMatch=await bcrypt.compare(password,user.password);
      console.log(user);
      if(passwordMatch){
        const token=generateToken(user);
        return res.status(201).json({
            success:true,
            token,
            user,
            message:"Login Succesfull"
        })
      }else{
        return errorResponse(res,401,"Invalid Credential..")
      }
    }catch(error){
        console.log(error);
        return errorResponse(res,500,"Server Error")
    }
}
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword||!newPassword){
      return errorResponse(res, 404, "All field Are required");
    }
    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 404, "Invalid User Id");
    }

    const matchPassword = await bcrypt.compare(oldPassword, user.password);

    if (!matchPassword) {
      return errorResponse(res, 401, "Incorrect");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    

    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully"
    });

  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Server Error");
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    let { name, email, address, role, sortbyname, sortbyaddress } = req.query;
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
    if (role) {
      query.role = role;
    }

    // Build sort object based on provided parameters
    const sort = {};
    if (sortbyname) {
      sort.name = sortbyname === 'asc' ? 1 : -1;
    }
    if (sortbyaddress) {
      sort.address = sortbyaddress === 'asc' ? 1 : -1;
    }

    // Fetch users based on constructed query and populate relevant fields
    const result = await User.find(query)
      .select('_id name email address role store')
      .populate({
        path: 'store',
        select: '_id name ratings',
        populate: {
          path: 'ratings',
          select: 'rating user'
        }
      })
      .sort(sort);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
