import express from "express";
import { login, register } from "../controllers/authController";
import validate from "../middlewares/validateMiddleware";
import { CreateUser, LoginUser } from "../utils/userValidation";

const router = express.Router();

router.post("/auth/login", validate(LoginUser), login);
router.post("/auth/register", validate(CreateUser), register);

export default router;
