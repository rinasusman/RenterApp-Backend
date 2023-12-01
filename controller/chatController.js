import ChatModel from "../models/chatModel.js";


export const createChat = async (req, res) => {
    try {
        // Check if a chat with the same members already exists
        const existingChat = await ChatModel.findOne({
            members: {
                $all: [req.body.senderId, req.body.receiverId],
            },
        });
        console.log(existingChat, "existingChat:")
        if (existingChat) {
            // Chat already exists, return a response
            return res.status(200).json(existingChat);
        }

        // Create a new chat
        const newChat = new ChatModel({
            members: [req.body.senderId, req.body.receiverId],
        });

        const result = await newChat.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getuserChat = async (req, res) => {
    try {
        const chat = await ChatModel.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const findChat = async (req, res) => {
    try {
        const chat = await ChatModel.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
};