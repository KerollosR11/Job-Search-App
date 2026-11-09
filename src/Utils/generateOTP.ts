import { randomInt } from "node:crypto";


export const generateOTP = () :string =>{
    return String(randomInt(100000, 1000000));
}


export const getOTPExpiry = (): Date => {
  const expiry = new Date();

  expiry.setMinutes(
    expiry.getMinutes() + 5
  );

  return expiry;
};