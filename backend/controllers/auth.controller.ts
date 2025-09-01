import { Request, Response } from "express"
import bcryptjs from "bcryptjs"
import crypto from "crypto"
import jwt from "jsonwebtoken"
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

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            gender,
            pfp: gender === "male" ? boyProfilePic : girlProfilePic
        })

        if (newUser) {
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                gender: newUser.gender,
                pfp: newUser.pfp
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
        const {/*username*/ email, password} = req.body
        //const user = await User.findOne({username})
        const user = await User.findOne({email})
        const isCorrect = await bcryptjs.compare(password, user?.password || '')

        if (!user || !isCorrect) {
            return res.status(400).json({error: 'Invalid email or password'})
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

export const checkAuth = (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.jwt_refresh;

        if (refreshToken) {
            try {
                jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
                generateToken(req['user']['_id'], res);
            } catch (e) {
                return res.status(401).json({ message: "Invalid or Expired Refresh Token" });
            }
        }

        res.status(200).json(req['user']);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/*export const refreshToken = async(req: Request, res: Response): Promise<any> => {
    try {

    }
    catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}*/