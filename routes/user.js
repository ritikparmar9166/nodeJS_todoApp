import express from "express";
import {register , login, getMyProfile,logout} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", register);

router.post("/login", login);
router.get("/logout", logout);

// router.get("/userId/special", specialFunc);

//try to keep dynamic routing as low in your code so it will not coincide with "/userId/special"
router.get("/me", isAuthenticated, getMyProfile);

export default router;