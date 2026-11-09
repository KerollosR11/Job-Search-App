import { NextFunction, Request, Response } from "express";
import { BadRequestException, UnauthorizedException } from "../../Utils/Response/error.response";
import  jwt  from "jsonwebtoken";
import { env } from "../../Config/config.service";
import { RoleEnum } from "../../Utils/enums/user.enum";


export interface AuthenticatedRequest extends Request{
    user? :{
        userId :string,
        role :RoleEnum
    }
};

export const auth = (req :AuthenticatedRequest, res :Response, next :NextFunction)=>{
    const authorization = req.headers.authorization;

    if(!authorization){
        throw new BadRequestException("Authentication Required");
    }

    const [type, token] = authorization.split(" ");

    if(type !== "Bearer" || !token){
        throw new BadRequestException("Invalid Authorization header")
    }

    try {
        const decodePayload = jwt.decode(token) as {userId :string, role :RoleEnum} | null;

        if(!decodePayload || !decodePayload.role){
            throw new UnauthorizedException("Invalid token structure");
        }

        const signature = decodePayload.role === RoleEnum.ADMIN ? env.ACCESS_ADMIN_SIGNATURE : env.ACCESS_USER_SIGNATURE
        const verifiedPayload = jwt.verify(token, signature) as {userId :string, role :RoleEnum};

        req.user = {
            userId : verifiedPayload.userId,
            role: verifiedPayload.role
        }
        next();
    } catch (error) {
        throw new UnauthorizedException("Invalid or expired token");
    }
};