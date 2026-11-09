
import {Router} from "express";
import authService from "./auth.service";
import { validation } from "../../Middlewares/validation";
import * as validators from "./auth.validation";

const router = Router();


// router.get("/", authServices.checkRouter);

router.post("/signup", validation(validators.signupSchema), authService.signup);

router.post("/confirmEmail", validation(validators.confirmEmailSchema), authService.confirmEmail);

router.post("/newOTP", validation(validators.sentOTPSchema), authService.sendOTP);

router.post("/login", validation(validators.loginSchema), authService.login);

router.post("/forget-password", validation(validators.forgetPasswordSchema), authService.forgetPassword);

router.post("/reset-password", validation(validators.resetPasswordSchema), authService.resetPassword);


export default router;