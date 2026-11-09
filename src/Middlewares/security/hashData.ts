import bcrypt from "bcrypt";
import { env } from "../../Config/config.service";

export const hashData = async(data :string) :Promise<string>=>{
    let hashingData = await bcrypt.hash(data, env.SALT);
    return hashingData;
};

export const compareData = async(plainTxt :string, cypherTxt :string) :Promise<boolean>=>{
    let comparedData = await bcrypt.compare(plainTxt, cypherTxt);
    return comparedData;
};