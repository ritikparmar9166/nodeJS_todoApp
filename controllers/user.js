import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("invalid email or passoward", 400));
    // if (!user) {              iski jagah upar wali line use ki
    //   return res.status(404).json({
    //     success: false,
    //     message: "invalid email or passoward",
    //   });
    // }
    const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "invalid email or passoward",
    //   });
    // }
    if (!isMatch)
      return next(new ErrorHandler("invalid email or passoward", 400));

    sendCookie(user, res, `welcome back, ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    // if (user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User already exist",
    //   });
    // }
    if (user) return next(new ErrorHandler("User already exist", 400));
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashedPassword });
    sendCookie(user, res, "Registered succesfully", 201);
  } catch (error) {
    next(error);
  }
};

// export const specialFunc = (req, res)=>{
//     res.json({
//         success:true,
//         message:"just joking",
//     });
// };

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", { 
      expires: new Date(Date.now()), 
      sameSite: process.env.NODE_ENV==="Development" ? "lax" : "none",
      secure: process.env.NODE_ENV==="Development" ? false : true,
    })
    .json({
      success: true,
      user: req.user,
    });
};
