import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "./Auth/auth"
import { ForbiddenException, UnauthorizedException } from "../Utils/Response/error.response"
import { RoleEnum } from "../Utils/enums/user.enum"


export const authorization = (...allowedRoles :RoleEnum[])=>{
    return (req :AuthenticatedRequest, res :Response, next :NextFunction)=>{
        if(!req.user){
            throw new UnauthorizedException("You are NOT Authorized to access Service");
        }

        if(!allowedRoles.includes(req.user.role)){
            throw new ForbiddenException("You are NOT Authorized to access this Route")
        }

        next();
    }
}