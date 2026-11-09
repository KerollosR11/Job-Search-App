
export const verifyEmailTemplate = (
    username: string,
    otp: string
): string => 

    `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
        ">

            <div style="
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 10px;
                text-align: center;
            ">

                <h1 style="
                    color: #333333;
                    margin-bottom: 20px;
                ">
                    Verify Your Email
                </h1>

                <p style="
                    color: #555555;
                    font-size: 16px;
                ">
                    Hello ${username},
                </p>

                <p style="
                    color: #555555;
                    font-size: 16px;
                    line-height: 1.6;
                ">
                    Thank you for creating an account with us.
                    Please use the verification code below to verify your email address.
                </p>

                <div style="
                    margin: 30px 0;
                    padding: 20px;
                    background-color: #f0f0f0;
                    border-radius: 8px;
                ">

                    <span style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: #222222;
                    ">
                        ${otp}
                    </span>

                </div>

                <p style="
                    color: #777777;
                    font-size: 14px;
                ">
                    This code will expire soon.
                    If you did not create this account, you can safely ignore this email.
                </p>

                <p style="
                    margin-top: 30px;
                    color: #999999;
                    font-size: 12px;
                ">
                    © ${new Date().getFullYear()} Your App. All rights reserved.
                </p>

            </div>

        </body>
        </html>
    `;

