import { Request, Response } from "express"
import bcryptjs from "bcryptjs"
import crypto from "crypto"
import jwt from "jsonwebtoken"

import User from "../models/user.model"
import { generateRefreshToken, generateToken } from "../utils/generateToken"
import * as AuthHelper from "../helpers/auth.helper"
import { sendMail } from "../helpers/mailer.helper"

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, email, password, confirmPassword, gender } = req.body

        await AuthHelper.validatePasswords(password, confirmPassword)
        await AuthHelper.validateUsername(username)
        await AuthHelper.validateEmail(email)

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const emailToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            username,
            email,
            password: await AuthHelper.generateHashedPassword(password),
            gender,
            pfp: gender === "male" ? boyProfilePic : girlProfilePic,
            emailToken,
            emailTokenExpires: Date.now() + 3600000
        })

        if (newUser) {
            await newUser.save();

            try {
                await sendMail("register", email, emailToken)
            }
            catch (e) {
                res.status(500).json({ error: 'Internal server error' })
            }

            res.status(201).json({ message: 'We’ve sent you a verification email. Please check your inbox to verify your account.' })
        }
        else {
            res.status(400).json({ error: 'Invalid user data' })
        }
    }
    catch (e: any) {
        //console.log('Error in AuthController: ', e)
        res.status(e.status || 500).json({ error: e.error || 'Internal server error' })
    }
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body

        await AuthHelper.verifyUser(email)

        const user = await User.findOne({ email })
        const isPasswordCorrect = await bcryptjs.compare(password, user?.password || '')

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid email or password' })
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
    catch (e: any) {
        res.status(e.status || 500).json({ error: e.error || 'Internal server error' })
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            res.status(400).json({ error: 'You cannot log out because you are not logged in.' })
        }
        else {
            let decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

            if (decodedToken) {
                const user = await User.findById(decodedToken["userId"])
                user!.jwt = "";
                await user!.save();
            }

            res.clearCookie("jwt")
            //res.clearCookie("jwt_refresh")

            res.status(200).json({ message: 'Logged out successfully' })
        }
    }
    catch (e: any) {
        res.status(e.status || 500).json({ error: e.error || 'Internal server error' })
    }
}

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400).json({ error: 'No token' })
        }

        const user = await User.findOne({ emailToken: token });
        if (!user) {
            return res.status(400).json({ error: 'Invalid token' })
        }

        if (user.emailTokenExpires) {
            if (user.emailTokenExpires.getTime() < Date.now()) {
                return res.status(400).json({ error: 'Token expired' })
            }
        }

        user.isEmailVerified = true;
        user.emailToken = "";
        user.emailTokenExpires = undefined;
        await user.save();

        return res.status(200).json({ message: 'Your email has been successfully verified' })
    }
    catch (e: any) {
        res.status(e.status || 500).json({ error: e.error || 'Internal server error' })
    }
}

export const resendEmailVerification = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body

        if (email < 6 || email > 254) {
            return res.status(400).json({ error: 'Your email must be 6–254 characters long.' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(200).json({ message: 'We’ve sent you a verification email. Please check your inbox to verify your account.' })
        }

        const now = new Date(Date.now())
        if (user.emailTokenRequestedAt && now.getTime() - user.emailTokenRequestedAt.getTime() < 5 * 60 * 1000) {
            return res.status(429).json({ error: "You can request a new verification email in a few minutes." })
        }

        if (user && !user.isEmailVerified) {
            const emailToken = crypto.randomBytes(32).toString('hex');
            user.emailToken = emailToken
            user.emailTokenExpires = new Date(Date.now() + 3600000)
            await user.save()

            try {
                await sendMail("verifyEmail", email, emailToken)
            }
            catch (e) {
                res.status(500).json({ error: 'Internal server error' })
                //console.log(e)
            }

            user.emailTokenRequestedAt = new Date(Date.now())
            await user.save()

            res.status(200).json({ message: 'We’ve sent you a verification email. Please check your inbox to verify your account.' })
        }
    }
    catch (e: any) {
        res.status(e.status || 500).json({ error: e.error || 'Internal server error' })
    }
}

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body

        if (email < 6 || email > 254) {
            return res.status(400).json({ error: 'Your email must be 6–254 characters long.' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(200).json({ message: 'We’ve sent you an email with instructions to reset your password.' })
        }

        const now = new Date(Date.now())
        if (user.resetPasswordRequestedAt && now.getTime() - user.resetPasswordRequestedAt.getTime() < 5 * 60 * 1000) {
            return res.status(429).json({ error: "You can request a new password reset email in a few minutes." })
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken
        user.resetPasswordTokenExpires = new Date(Date.now() + 3600000) // 1h
        await user.save()

        try {
            await sendMail("resetPassword", email, resetToken)
        }
        catch (e) {
            res.status(500).json({ error: 'Internal server error' })
            //console.log(e)
        }

        user.resetPasswordRequestedAt = new Date(Date.now())
        await user.save()

        res.status(200).json({ message: 'We’ve sent you an email with instructions to reset your password.' })
    }
    catch (e: any) {
        res.status(e.status || 500).json({ error: e.error || 'Internal server error' })
    }
}

export const verifyResetPasswordToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.query

        await AuthHelper.validateResetPasswordToken(token.toString())

        res.status(200).json({ message: "Token verified successfully. You may proceed to reset your password." })
    } 
    catch (e: any) {
        res.status(e.status || 500).json({ error: e.error || 'Internal server error' })
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token, password, confirmPassword } = req.body

        const user = await AuthHelper.validateResetPasswordToken(token)
        await AuthHelper.validatePasswords(password, confirmPassword)

        user.password = await AuthHelper.generateHashedPassword(password)
        user.resetPasswordToken = ""
        user.resetPasswordTokenExpires = undefined
        await user.save()

        return res.status(200).json({ message: 'Your password has been successfully reset.'})
    }
    catch (e: any) {
        res.status(e.status || 500).json({ error: e.error || 'Internal server error' })
    }
}

export const checkAuth = (req: Request, res: Response): void => {
    try {
        /*const refreshToken = req.cookies.jwt_refresh;

        if (refreshToken) {
            try {
                jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
                generateToken(req['user']['_id'], res);
            } catch (e) {
                res.status(401).json({ message: "Invalid or Expired Refresh Token" });
                return;
            }
        }*/

        res.status(200).json(req['user']);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};