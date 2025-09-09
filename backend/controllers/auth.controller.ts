import { Request, Response } from "express"
import bcryptjs from "bcryptjs"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import User from "../models/user.model"
import { generateRefreshToken, generateToken } from "../utils/generateToken"


export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const {username, email, password, confirmPassword, gender} = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({error: "Passwords doesn't matches"})
        }

        // Valid password = 12 char - 64 char, 1 upper case, 1 lower case, 1 number, 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,64}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({error: 'Please use a valid password'})
        }
        
        const user = await User.findOne({username})

        if (user) {
            return res.status(400).json({error: 'Username already exists'})
        }
        else if (username < 3 || username > 30) {
            return res.status(400).json({error: 'Your username must be 3–30 characters long.'})
        } 

        const existingEmail = await User.findOne({email})

        if (existingEmail) {
            return res.status(400).json({error: 'Please choose another email address'})
        }
        else if (email < 6 || email > 254) {
            return res.status(400).json({error: 'Your email must be 6–254 characters long.'})    
        }

        const knownProviders = [
            'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com', 'icloud.com',
            'protonmail.com', 'proton.me', 'yandex.com', 'aol.com', 'gmx.com'
        ];

        const mailProvider = email.match('^[^@]+@(.+)$')[1];

        if (!knownProviders.includes(mailProvider)) {
            return res.status(400).json({error: 'Please use a valid mail provider'})
        }

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)

        const emailToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            gender,
            pfp: gender === "male" ? boyProfilePic : girlProfilePic,
            emailToken,
            emailTokenExpires: Date.now() + 3600000
        })

        if (newUser) {
            await newUser.save();

            const transporter = nodemailer.createTransport({
                host: "localhost",
                port: 1025,
                ignoreTLS: true
            });

            try {
                await transporter.sendMail({
                    from: '"Chat App" <no-reply@chatapp.com>',
                    to: email,
                    subject: 'Verify your Email',
                    text: `Please verify your account by clicking the link: http://localhost:5173/verify-email?token=${emailToken}`,
                    html: `
                    <!doctype html>
                    <html>
                        <body>
                            <div style="font-family: sans-serif; padding: 20px;">
                                <h2>Verify your email</h2>
                                <p>Thanks for signing up! Please confirm your email by clicking the button below:</p>
                                <p style="padding-top: 15px; padding-bottom: 15px;">
                                    <a href="http://localhost:5173/verify-email?token=${emailToken}" style="background: #2563eb; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
                                    Verify my email
                                    </a>
                                </p>
                                <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                                <p><a href="http://localhost:5173/verify-email?token=${emailToken}">http://localhost:5173/verify-email?token=${emailToken}</a></p>
                            </div>
                        </body>
                    </html>
                    `
                })
            }
            catch (e) {
                res.status(500).json({error: 'Internal server error'})
                console.log(e)
            }

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                gender: newUser.gender,
                pfp: newUser.pfp,
                message: 'We’ve sent you a verification email. Please check your inbox to verify your account.'
            })
        }
        else {
            res.status(400).json({error: 'Invalid user data'})
        }
        
    }   
    catch (e) {
        console.log('Error in AuthController: ', e)
        res.status(500).json({error: 'Internal server error'})
    }
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        const isCorrect = await bcryptjs.compare(password, user?.password || '')
        
        if (user && user.isBanned) {
            return res.status(403).json({error: 'Your account has been suspended.'})
        }

        if (!user || !isCorrect) {
            return res.status(400).json({error: 'Invalid email or password'})
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({errorType: 'emailNotVerified', error: 'Please verify your email before logging in.'})
        }

        const newJwt = generateToken(user._id.toString(), res)        
        const hashedToken = crypto.createHash("sha256").update(newJwt).digest("hex");
        user.jwt = hashedToken;

        await user.save()

        //generateRefreshToken(user._id.toString(), res)

        res.status(200).json({
            _id: user._id,
            username: user.username,
            gender: user.gender,
            pfp: user.pfp
        })
    }
    catch (e) {
        res.status(500).json({error: 'Internal server error'})
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.jwt
        
        if (!token) {
            res.status(400).json({error: 'You cannot log out because you are not logged in.'})
        }
        else {
            let decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

            if (decodedToken) {
                const user = await User.findById(decodedToken["userId"])
                user!.jwt = "";
                await user?.save();
            }

            res.clearCookie("jwt")
            //res.clearCookie("jwt_refresh")

            res.status(200).json({message: 'Logged out successfully'})            
        }
    }
    catch (e) {
        res.status(500).json({error: 'Internal server error'})
    }
}

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400).json({error: 'No token'})
        }

        const user = await User.findOne({ emailToken: token });
        if (!user) {
            return res.status(400).json({error: 'Invalid token'})
        }

        if (user.emailTokenExpires) {
            if (user.emailTokenExpires.getTime() < Date.now()) {
                return res.status(400).json({error: 'Token expired'})
            }
        }

        user.isEmailVerified = true;
        user.emailToken = "";
        user.emailTokenExpires = undefined;
        await user.save();

        return res.status(200).json({message: 'Your email has been successfully verified'})
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const resendEmailVerification = async (req: Request, res: Response): Promise<any> => {
    const {email} = req.body

    const user = await User.findOne({email})

    if (user && user.isEmailVerified) {
        return res.status(200).json({message: 'We’ve sent you a verification email. Please check your inbox to verify your account.'})
    }

    if (email < 6 || email > 254) {
        return res.status(400).json({error: 'Your email must be 6–254 characters long.'})    
    }

    if (user && !user.isEmailVerified) {
        const emailToken = crypto.randomBytes(32).toString('hex');
        user.emailToken = emailToken
        user.emailTokenExpires = new Date(Date.now() + 3600000)

        await user.save()

        const transporter = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            ignoreTLS: true
        });

        try {
            await transporter.sendMail({
                from: '"Chat App" <no-reply@chatapp.com>',
                to: email,
                subject: 'Verify your Email',
                text: `Please verify your account by clicking the link: http://localhost:5173/verify-email?token=${emailToken}`,
                html: `
                <!doctype html>
                <html>
                    <body>
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2>Verify your email</h2>
                            <p>Thanks for signing up! Please confirm your email by clicking the button below:</p>
                            <p style="padding-top: 15px; padding-bottom: 15px;">
                                <a href="http://localhost:5173/verify-email?token=${emailToken}" style="background: #2563eb; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
                                Verify my email
                                </a>
                            </p>
                            <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                            <p><a href="http://localhost:5173/verify-email?token=${emailToken}">http://localhost:5173/verify-email?token=${emailToken}</a></p>
                        </div>
                    </body>
                </html>
                `
            })

            res.status(200).json({message: 'We’ve sent you a verification email. Please check your inbox to verify your account.'})
        }
        catch (e) {
            res.status(500).json({error: 'Internal server error'})
            console.log(e)
        }
    }
}

export const checkAuth = (req: Request, res: Response): void => {
    try {
        const refreshToken = req.cookies.jwt_refresh;

        if (refreshToken) {
            try {
                jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
                generateToken(req['user']['_id'], res);
            } catch (e) {
                res.status(401).json({ message: "Invalid or Expired Refresh Token" });
                return;
            }
        }

        res.status(200).json(req['user']);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

