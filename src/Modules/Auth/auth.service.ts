import { Request, Response } from "express";
import { UserModel } from "../../DB/Models/user.model";
import { BadRequestException, ConflictException, NotFoundException } from "../../Utils/Response/error.response";
import { compareData, hashData } from "../../Middlewares/security/hashData";
import { generateOTP, getOTPExpiry } from "../../Utils/generateOTP";
import { OTPTypeEnum, ProviderEnum } from "../../Utils/enums/user.enum";
import { sendEmail } from "../../Utils/email/send.email";
import { verifyEmailTemplate } from "../../Utils/email/verify.email.template";
import { SuccessResponse } from "../../Utils/Response/success.response";
import { createLoginCredentials } from "../../Middlewares/Auth/token";


class AuthServices{
    constructor(){

    }

    signup = async(req :Request, res :Response) :Promise<Response>=>{

        const {firstName, lastName, email, password, gender, DOB , mobileNumber} = req.body;
        const checkExist = await UserModel.findOne({email: email});
        if(checkExist){
            throw new ConflictException("User Already exist!!");
        }

        const hashingPW = await hashData(password);
        const otp = generateOTP();
        const hashingOTP = await hashData(otp);
        const expiresAt = getOTPExpiry();

        const [newUser] = await UserModel.create(
            [
                {
                    firstName,
                    lastName,
                    email,
                    password: hashingPW,
                    gender,
                    DOB,
                    mobileNumber,
                    OTP: [
                        {
                            code: hashingOTP,
                            type: OTPTypeEnum.CONFIRM_EMAIL,
                            expiresAt: expiresAt
                        }
                    ]
                }
            ],
            {
                validateBeforeSave: true
            }
        );

        await sendEmail(
            email,
            "Confirm your Email",
            verifyEmailTemplate(firstName, otp) 
        );
        return res.status(201).json({message:"User Added Successfully!", Data: newUser})
    };

    confirmEmail = async(req :Request, res :Response) :Promise<Response>=>{
        const {email, otp} = req.body;
        const user = await UserModel.findOne({email : email});
        if(!user){
            throw new NotFoundException("User Not Found!");
        }

        if(user.isConfirmed){
            throw new BadRequestException("User's email already confirmed");
        }

        const confirmationOTP = user.OTP.find(
            (item)=>{
                return item.type === OTPTypeEnum.CONFIRM_EMAIL;
            }
        );
        if(!confirmationOTP){
            throw new NotFoundException("Confirmation OTP Not Found");
        }
        if(confirmationOTP.expiresAt < new Date()){
            throw new BadRequestException("OTP has expired, try request new OTP");
        }

        const isValidOTP = await compareData(otp, confirmationOTP.code);
        if(!isValidOTP){
            throw new ConflictException("Invalid OTP");
        }

        user.isConfirmed = true;
        user.OTP = user.OTP.filter(
            (item)=>{
                item.type !== "confirmEmail";
            }
        );

        await user.save();
        return SuccessResponse({
            res,
            statusCode: 200,
            message: "Email Confirmed Successfully",
            data: user
        });
    };

    sendOTP = async(req :Request, res :Response) :Promise<Response>=>{
        const {email, otpType} = req.body;

        const otp = generateOTP();
        const hashingOTP = await hashData(otp);
        const expiresAt = getOTPExpiry();

        const user = await UserModel.findOne({email : email});
        if(!user){
            throw new NotFoundException("User Not Found!");
        }

        const existingOTPIndex = user.OTP.findIndex(
            (item)=>{
                return item.type === otpType
            }
        );
        if(existingOTPIndex !== -1){ // already exist
            user.OTP[existingOTPIndex]!.code = hashingOTP; // ! i'am sure enha
            user.OTP[existingOTPIndex]!.expiresAt = expiresAt
        }else{
            user.OTP.push({
                code: hashingOTP,
                type: otpType,
                expiresAt: expiresAt
            });
        }
        await user.save();

        await sendEmail(
            email,
            "Confirm your Email",
            verifyEmailTemplate(user.firstName, otp) 
        );

        return SuccessResponse({
            res,
            statusCode: 200,
            message: "New OTP was sent Successfully",
            data: user
        });
    };

    login = async(req :Request, res :Response) :Promise<Response>=>{
        const {email, password} = req.body;
        const user = await UserModel.findOne({email : email});
        if(!user){
            throw new NotFoundException("User Not Found!");
        }

        const isValidPW = await compareData(password, user.password);
        if(!isValidPW){
            throw new BadRequestException("invalid Email or Password, Please try again later");
        }

        const loginCredentials = createLoginCredentials(user);
        
        return SuccessResponse({
            res,
            statusCode: 200,
            message: "User logged in Successfully",
            data: loginCredentials
        });
    };

    forgetPassword = async(req :Request, res :Response) :Promise<Response>=>{
        const {email} = req.body;
        const user = await UserModel.findOne({email : email});
        if(!user){
            throw new NotFoundException("User Not Found!");
        }

        const otp = generateOTP();
        const hashingOTP = await hashData(otp);
        const expiresAt = getOTPExpiry();

        user.OTP = user.OTP.filter(
            (item)=>{
                return item.type !== OTPTypeEnum.FORGET_PASSWORD
            }
        );
        user.OTP.push({
            code: hashingOTP,
            type: OTPTypeEnum.FORGET_PASSWORD,
            expiresAt: expiresAt
        });
        
        await user.save();

        await sendEmail(
            email,
            "Reset your Password",
            // verifyEmailTemplate(user.firstName, otp)
            `
              <div>
                <h2>Reset Your Password</h2>
                <p>Your password reset OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you did not request a password reset, ignore this email.</p>
              </div>
            `
        );

        return SuccessResponse({
            res,
            statusCode: 200,
            message: "Password Reset OTP sent Successfully"
        });
    };

    resetPassword = async(req :Request, res :Response) :Promise<Response>=>{
        const {email, otp, newPassword, confirmPassword} = req.body;
        const user = await UserModel.findOne({email : email, provider: ProviderEnum.SYSTEM});
        if(!user){
            throw new NotFoundException("User Not Found!");
        }

        if(confirmPassword !== newPassword){
            throw new ConflictException("Password not matched");
        }

        const resetPwOTP = user.OTP.find(
            (item)=>{
                return item.type === OTPTypeEnum.FORGET_PASSWORD;
            }
        );
        if(!resetPwOTP){
            throw new NotFoundException("Confirmation OTP Not Found");
        }
        if(resetPwOTP.expiresAt < new Date()){
            throw new BadRequestException("OTP has expired, try request new OTP");
        }

        const isValidOTP = await compareData(otp, resetPwOTP.code);
        if(!isValidOTP){
            throw new ConflictException("Invalid OTP");
        }

        const hashingPW = await hashData(newPassword);

        user.password = hashingPW;

        user.changeCredentialTime = new Date();

        user.OTP = user.OTP.filter(
            (item) => item.type !== OTPTypeEnum.FORGET_PASSWORD
        );

        return SuccessResponse({
            res,
            statusCode: 200,
            message: "Password Reset Successfully"
        });
    };
};


export default new AuthServices;