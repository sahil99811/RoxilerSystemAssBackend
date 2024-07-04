const jwt = require('jsonwebtoken');
const errorResponse=(res,statusCode,message)=>{
    res.status(statusCode).json({
        success:false,
        message
    })
}
exports.auth=async (req,res,next)=>{
   try {
    const token=req.header("Authorization").replace("Bearer ","");
    if(!token){
        return res.status(401).json({ success: false, message: `Token Missing` });
    }
    try {
        // Verifying the JWT using the secret key stored in environment variables
        const decode = await jwt.verify(token, process.env.JWT_SECRET);

        // Storing the decoded JWT payload in the request object for further use
        req.user = decode;
    } catch (error) {
        // If JWT verification fails, return 401 Unauthorized response
        console.log(error);
        return res.status(401).json({ success: false, message: "Token is invalid or Token is expired" });
    }

    // If JWT is valid, move on to the next middleware or request handler
    next();
    
   } catch (error) {
    return res.status(403).json({
        success: false,
        message: `Something went wrong while validating the token`,
    });
   }
}

exports.isAdmin = async (req, res, next) => {
	try {
		
		if (req.user.role != "admin") {
            return errorResponse(res,401,"This is a Protected Route for Admin")
			
		}
		next();
	} catch (error) {
        return errorResponse(res,500,"User Role Can't be Verified")
	}
};

exports.isUser = async (req, res, next) => {
	try {
		
		if (req.user.role != "user") {
            return errorResponse(res,401,"This is a Protected Route for Normal Users")
			
		}
		next();
	} catch (error) {
        return errorResponse(res,500,"User Role Can't be Verified")
	}
};

exports.isStoreOwner = async (req, res, next) => {
	try {
		
		if (req.user.role != "storeOwner") {
            return errorResponse(res,401,"This is a Protected Route for Store Owner")
			
		}
		next();
	} catch (error) {
        return errorResponse(res,500,"User Role Can't be Verified")
	}
};