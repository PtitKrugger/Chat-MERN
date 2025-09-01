import { Request, Response } from "express"
import User from "../models/user.model"

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const currentUserId = req['user']._id
        const filteredUsers = await User.find({ _id: {$ne: currentUserId} }).select("-email -password -gender -createdAt -updatedAt -__v")

        res.status(200).json(filteredUsers)
    }
    catch (e) {
        res.status(500).json({error: 'Internal server error'})
    }
}