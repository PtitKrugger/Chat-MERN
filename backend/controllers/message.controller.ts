import { Request, Response } from "express"
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import { findUserSocketId, getIO, isUserConnected } from "../socket";

export const sendMessage = async (req: Request, res: Response): Promise<any> => {
    try {
        const { message } = req.body
        const { id: receiverId } = req.params
        const senderId = req['user']._id;

        if (!message)  {
            res.status(400).send()
            return;
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
            await Promise.all([conversation.save(), newMessage.save()])
            
            const io = getIO()

            if (isUserConnected(receiverId)) {
                io.to(findUserSocketId(receiverId)).emit("receiveMessage", newMessage)
            }

            res.status(201).json(newMessage)
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({error: 'Internal server error'})
    }
}

export const getMessages = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id: userToChatId } = req.params
        const senderId = req['user']._id

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages")

        if (!conversation) {
            return res.status(200).json([])
        }

        const messages = conversation.messages

        res.status(200).json(messages)
    }
    catch (e) {
        console.log("Error in Message Controller: " + e)
        res.status(500).json({error: 'Internal server error'})
    }
}
