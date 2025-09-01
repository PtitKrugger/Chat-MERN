import mongoose from "mongoose";
import dotenv from "dotenv";
import { consoleLog } from "../utils/customConsole";
dotenv.config({ path: '../../.env' });

export default async function connectToDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string)
        consoleLog('DB', 'INFO', 'Connected')
    } catch (e) {
        console.error('Error while connecting to DB: ', e.message)
    }
}