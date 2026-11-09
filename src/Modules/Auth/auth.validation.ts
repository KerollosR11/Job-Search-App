import joi from "joi"
import { GenderEnum, OTPTypeEnum } from "../../Utils/enums/user.enum";

export const signupSchema ={
    body: joi.object({
        firstName: joi.string().min(2).max(25).required(),
        lastName: joi.string().min(2).max(25).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        confirmPassword: joi.string().valid(joi.ref("password")).required(),
        gender: joi.string().valid(...Object.values(GenderEnum)).required(),
        DOB: joi.date().less("now").required(),
        mobileNumber: joi.string().required()
    })
};

export const confirmEmailSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        otp: joi.string().length(6).pattern(/^[0-9]+$/).required()
    })
} 


export const sentOTPSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        otpType: joi.string().valid(...Object.values(OTPTypeEnum)).required()
    })
} 

export const loginSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    })
} 

export const forgetPasswordSchema = {
    body: joi.object({
        email: joi.string().email().required()
    })
} 

export const resetPasswordSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        otp: joi.string().length(6) .pattern(/^[0-9]+$/).required(),
        newPassword: joi.string().min(8).required(),
        confirmPassword: joi.any() .valid(joi.ref("newPassword")).required()
    })
} 


