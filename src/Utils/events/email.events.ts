// import { EventEmitter } from "node:events";
// import { Mail } from "nodemailer";
// import { verifyEmailTemplate } from "../email/verify.email.template";
// import { sendEmail } from "../email/send.email";


// export const emailEvents = new EventEmitter();


// interface IEmail extends Mail.Options{
//     otp :string;
//     username :string;
// }

// emailEvents.on("confirmEmail", async (data :IEmail)=>{
//     try {
//         data.subject = "Confirm your Email";
//         data.html = verifyEmailTemplate(data.otp, data.username);
//         await sendEmail(data)
//     } catch (error) {
//         console.error("Failed to send email ", error);
//     }
// });