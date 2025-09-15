import bcryptjs from "bcryptjs"

import User from "../models/user.model"

export async function verifyUser(email: string) {
    const user = await User.findOne({ email })

    if (user && user.isBanned) {
       throw { status: 403, error: "Your account has been suspended." }
    }

    if (user && !user.isEmailVerified) {
        throw { status: 403, error: "Please verify your email before logging in." }
    }
}

export async function validateUsername(username: string) {
    const user = await User.findOne({ username })

    if (user) {
        throw { status: 400, error: "Username already exists" }
    }
    else if (username.length < 3 || username.length > 30) {
        throw { status: 400, error: "Your username must be 3–30 characters long." }
    }
}

export async function validateEmail(email: string) {
    const existingEmail = await User.findOne({ email })

    if (existingEmail) {
        throw { status: 400, error: "Please choose another email address" }
    }
    else if (email.length < 6 || email.length > 254) {
        throw { status: 400, error: "Your email must be 6–254 characters long." }
    }

    const match = email.match('^[^@]+@(.+)$');
    if (!match) {
        throw { status: 400, error: "Invalid email format" }
    }

    const knownProviders = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com', 'icloud.com',
        'protonmail.com', 'proton.me', 'yandex.com', 'aol.com', 'gmx.com'
    ];
    const mailProvider = match[1]

    if (!knownProviders.includes(mailProvider)) {
        throw { status: 400, error: "Please use a valid mail provider" }
    }
}

export async function validatePasswords(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
        throw { status: 400, error: "Passwords doesn't matches" }
    }

    // Valid password = 12 char - 64 char, 1 upper case, 1 lower case, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,64}$/;
    if (!passwordRegex.test(password)) {
        throw { status: 400, error: "Please use a valid password" }
    }
}

export async function validateResetPasswordToken(token: string) {
    if (!token) {
        throw { status: 400, error: "No token" }
    }
  
    const user = await User.findOne({ resetPasswordToken: token })
    if (!user) {
        throw { status: 400, error: "Invalid token" }
    }
  
    if (user.resetPasswordTokenExpires && user.resetPasswordTokenExpires.getTime() < Date.now()) {
        throw { status: 410, error: "Token expired" }
    }
  
    return user
}

export async function generateHashedPassword(password: string) {
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    return hashedPassword
}

