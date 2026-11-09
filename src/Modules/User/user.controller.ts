import {Router} from "express";
import { auth } from "../../Middlewares/Auth/auth";
import userService from "./user.service";
import * as userValidators from "./user.validation"
import { validation } from "../../Middlewares/validation";




const router = Router();

router.get("/profile", auth, userService.getProfile);

router.post("/update-profile", auth, validation(userValidators.updateProfileSchema), userService.updateProfile);

router.post("/change-password", auth, validation(userValidators.uchangePasswordSchema), userService.changePassword);

router.delete("/delete-account", auth, userService.softDelete);



export default router;