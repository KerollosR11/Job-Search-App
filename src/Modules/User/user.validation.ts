import Joi from "joi";
import { GenderEnum } from "../../Utils/enums/user.enum";

export const updateProfileSchema = {
    body : Joi.object({
        firstName: Joi.string().min(2).max(25),
        lastName: Joi.string().min(2).max(25),
        gender: Joi.string().valid(...Object.values(GenderEnum)),
        DOB: Joi.date().less("now"),
        mobileNumber: Joi.string()
    }).min(1)
};

export const uchangePasswordSchema = {
    body : Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required(),
        confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required()
    })
};



