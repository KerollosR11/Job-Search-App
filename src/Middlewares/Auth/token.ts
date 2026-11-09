import { Secret, sign, SignOptions } from "jsonwebtoken"
import { HUserDoc } from "../../DB/Models/user.model"
import { RoleEnum } from "../../Utils/enums/user.enum"
import { env } from "../../Config/config.service"


export const generateToken = ({payload, secret, options} : {payload :object, secret :Secret, options :SignOptions}) =>{
    return sign(payload, secret, options);
}

export const createLoginCredentials = (user :HUserDoc) :{accessToken :string, refreshToken :string}=>{

    const isAdmin = user.role === RoleEnum.ADMIN;
    const accessSecret = isAdmin? env.ACCESS_ADMIN_SIGNATURE : env.ACCESS_USER_SIGNATURE;
    const refreshSecret = isAdmin? env.REFRESH_ADMIN_SIGNATURE : env.REFRESH_USER_SIGNATURE;

    const accessToken = generateToken({
        payload: {userId: user._id, role: user.role}, 
        secret: accessSecret, 
        options: {expiresIn: env.ACCESS_TOKEN_EXPIRES_IN} 
    });
    

    const refreshToken = generateToken({
        payload: {userId: user._id, role: user.role}, 
        secret: refreshSecret, 
        options: {expiresIn: env.REFRESH_TOKEN_EXPIRES_IN} 
    });


    return {accessToken, refreshToken};
};