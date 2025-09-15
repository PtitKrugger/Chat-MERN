import nodemailer from "nodemailer"

type MailType = "register" | "verifyEmail" | "resetPassword"

export async function sendMail(type: MailType, email: string, token?: string) {
    const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 1025,
        ignoreTLS: true
    });

    switch (type) {
        case "register":
            return await transporter.sendMail({
                from: '"Chat App" <no-reply@chatapp.com>',
                to: email,
                subject: 'Verify your Email',
                text: `Please verify your account by clicking the link: http://localhost:5173/verify-email?token=${token}`,
                html: `
                <!doctype html>
                <html>
                    <body>
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2>Verify your email</h2>
                            <p>Thanks for signing up! Please confirm your email by clicking the button below:</p>
                            <p style="padding-top: 15px; padding-bottom: 15px;">
                                <a href="http://localhost:5173/verify-email?token=${token}" style="background: #2563eb; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
                                Verify my email
                                </a>
                            </p>
                            <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                            <p><a href="http://localhost:5173/verify-email?token=${token}">http://localhost:5173/verify-email?token=${token}</a></p>
                        </div>
                    </body>
                </html>
                `
            })                
        case "verifyEmail":
            return await transporter.sendMail({
                from: '"Chat App" <no-reply@chatapp.com>',
                to: email,
                subject: 'Verify your Email',
                text: `Please verify your account by clicking the link: http://localhost:5173/verify-email?token=${token}`,
                html: `
                <!doctype html>
                <html>
                    <body>
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2>Verify your email</h2>
                            <p>Thanks for signing up! Please confirm your email by clicking the button below:</p>
                            <p style="padding-top: 15px; padding-bottom: 15px;">
                                <a href="http://localhost:5173/verify-email?token=${token}" style="background: #2563eb; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
                                Verify my email
                                </a>
                            </p>
                            <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                            <p><a href="http://localhost:5173/verify-email?token=${token}">http://localhost:5173/verify-email?token=${token}</a></p>
                        </div>
                    </body>
                </html>
                `
            })
        case "resetPassword": 
            return await transporter.sendMail({
                from: '"Chat App" <no-reply@chatapp.com>',
                to: email,
                subject: 'Reset your password',
                text: `You requested to reset your password. Click the link below to set a new one: http://localhost:5173/reset-password?token=${token}
                    If you did not request this, you can safely ignore this email.`,
                html: `
                    <!doctype html>
                    <html>
                        <body>
                            <div style="font-family: sans-serif; padding: 20px;">
                            <h2>Reset your password</h2>
                            <p>You requested to reset your password. Click the button below to set a new one:</p>
                            <p style="padding-top: 15px; padding-bottom: 15px;">
                                <a href="http://localhost:5173/reset-password?token=${token}" 
                                style="background: #2563eb; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
                                Reset my password
                                </a>
                            </p>
                            <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                            <p>
                                <a href="http://localhost:5173/reset-password?token=${token}">
                                http://localhost:5173/reset-password?token=${token}
                                </a>
                            </p>
                            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
                            <p style="font-size: 14px; color: #555;">
                                If you did not request a password reset, you can safely ignore this email.
                            </p>
                            </div>
                        </body>
                    </html>
                    `
            })
    }
}