import jwt from 'jsonwebtoken'
import { Response } from 'express'

export function generateToken(userId: string, res: Response): string {
    const token = jwt.sign({userId}, process.env.JWT_SECRET as string)

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + (15 * 60 * 1000)), // 15min (15 * 60 * 1000)
        httpOnly: true, // Anti XSS
        sameSite: "strict", // Anti CSRF
        secure: process.env.NODE_ENV !== "development"
    })

    return token
}

export function generateRefreshToken(userId: string, res: Response) {
    const refreshToken = jwt.sign({userId}, process.env.JWT_REFRESH_SECRET as string)

    res.cookie('jwt_refresh', refreshToken, {
        expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7d
        httpOnly: true, // Anti XSS
        sameSite: "strict", // Anti CSRF
        secure: process.env.NODE_ENV !== "development"
    })
}