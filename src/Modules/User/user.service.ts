import { Response } from "express";
import { SuccessResponse } from "../../Utils/Response/success.response";
import { AuthenticatedRequest } from "../../Middlewares/Auth/auth";
import { UserModel } from "../../DB/Models/user.model";
import { BadRequestException, ConflictException, NotFoundException } from "../../Utils/Response/error.response";
import { compareData, hashData } from "../../Middlewares/security/hashData";

class UserServices {
    constructor(){

    }

    getProfile = async(req :AuthenticatedRequest, res :Response) :Promise<Response>=>{
        const userId = req.user!.userId; 
        const user = await UserModel.findById(userId).select("-password -OTP");

        if(!user){
            throw new NotFoundException("User Not Found!");
        }

        return SuccessResponse({
            res,
            message: "User Fetched Successfully!",
            statusCode: 200,
            data: user
        })
    };

    updateProfile = async(req :AuthenticatedRequest, res :Response) :Promise<Response>=>{
        const userId = req.user!.userId;

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestException("No data provided for update!");
        }

        const user = await UserModel.findById(userId);
        if(!user){
            throw new NotFoundException("User Not Found!");
        }
 
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: req.body
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password -OTP");

        return SuccessResponse({
            res,
            message: "User Updated Successfully!",
            statusCode: 200,
            data: updatedUser
        });
    };

    changePassword = async(req :AuthenticatedRequest, res :Response) :Promise<Response>=>{
        const userId = req.user!.userId;
        const {oldPassword, newPassword} = req.body

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestException("No data provided for update!");
        }

        const user = await UserModel.findById(userId);
        if(!user){
            throw new NotFoundException("User Not Found!");
        }

        const isValidPw = await compareData(oldPassword, user.password);
        if(!isValidPw){
            throw new BadRequestException("Old password is not correct");
        }
        const hashNewPw = await hashData(newPassword);

        user.password = hashNewPw;
        user.changeCredentialTime = new Date();

        user.save();

        return SuccessResponse({
            res,
            message: "Password changed Successfully!",
            statusCode: 200,
            data: user
        });
    };

    softDelete = async(req :AuthenticatedRequest, res :Response) :Promise<Response>=>{
        const userId = req.user!.userId;

        const user = await UserModel.findById(userId);
        if(!user){
            throw new NotFoundException("User Not Found!");
        }

        if(user.deletedAt){
            throw new ConflictException("Account already deleted!");
        }

        user.deletedAt = new Date();

        user.save();

        return SuccessResponse({
            res,
            message: "Account Deleted Successfully!",
            statusCode: 200,
            data: user
        });
    };

}

export default new UserServices;


