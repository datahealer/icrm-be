import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();


// export const auth = async (req, res, next) => {
// 	try {
// 		const token =
// 			req.cookies.token ||
// 			req.body.token ||
// 			req.header("Authorization").replace("Bearer ", "");

// 		if (!token) {
// 			return res.status(401).json({ success: false, message: `Token Missing` });
// 		}

// 		try {
// 			const decode = await jwt.verify(token, process.env.JWT_SECRET);
// 			req.user = decode;
// 		} catch (error) {
// 			return res
// 				.status(401)
// 				.json({ success: false, message: "token is invalid" });
// 		}

// 		next();
// 	} catch (error) {
// 		return res.status(401).json({
// 			success: false,
// 			message: `Something Went Wrong While Validating the Token`,
// 		});
// 	}
// };

export const auth = async (req, res, next) => {
  try {
   
    let token = req.cookies.authToken;
    const apiKey = req.headers["x-api-key"];
    console.log(apiKey);
    if(apiKey  === process.env.SIGNUP_API_KEY){
      return next();
    }

    // Skip token verification for root user
    // if (req.user && req.user.userType === "ROOT") {
    //   return next();
    // }

    // If no token is provided, return a 401 response
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: `Unauthorized Request` });
    }

    // Verify the token
    try {
      const decode =  jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid" });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Something went wrong while validating the token`,
    });
  }
};

export const isRoot = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.userType !== "ROOT") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for ROOT Users",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isSalesManager = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.userType !== "SALES_MANAGER") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Sales Managers",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isHR = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.userType !== "HR") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for HR",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isProjectManager = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.userType !== "PROJECT_MANAGER") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Project Managers",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isClient = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.userType !== "CLIENT") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Clients",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isReferralPartner = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.userType !== "REFERRAL_PARTNER") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Referral Partners",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isFinanceManager = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.userType !== "FINANCE_MANAGER") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Finance Managers",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isContractor = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.userType !== "CONTRACTOR") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Contractors",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};
