import { createTransport } from "nodemailer";
import { env } from "../../Config/config.service";
/*
export const sendEmail = async (data :Mail.Options) :Promise<void>=>{

    if(!data.html && !data.attachments?.length && !data.text){
        throw new BadRequestException("Missing Email Content");
    }

    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: env.GOOGLE_ACCOUNT_EMAIL,
            pass: env.GOOGLE_APP_PASSWORD
        }
    });

    await transporter.sendMail({
        ...data,
        from: `"Job Search App" <${env.GOOGLE_ACCOUNT_EMAIL}>`,
        
    })
}

*/

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: env.GOOGLE_ACCOUNT_EMAIL,
        pass: env.GOOGLE_APP_PASSWORD
    }
});

export const sendEmail = async(to :string, subject :string, html :string) :Promise<void>=>{

    await transporter.sendMail({
        from:  `"Job Search App" <${env.GOOGLE_ACCOUNT_EMAIL}>`,
        to,
        subject,
        html
    });
}