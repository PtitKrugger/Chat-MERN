import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model";

const protectRoute = async (req: Request, res: Response, next: Function): Promise<any> => {
    try {
        const token = req.cookies.jwt;
        //const refreshToken = req.cookies.jwt_refresh;

        if (!token /*&& !refreshToken*/) {
            return res.status(401).json({ error: "Unauthorized Access - No Token" });
        }

        let decodedToken: string | JwtPayload;

        try {
            if (token) {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

                if (decodedToken) {
                    const user = await User.findById(decodedToken["userId"])
                    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
                    const isJwtCorrect = hashedToken === user?.jwt;

                    if (!isJwtCorrect) {
                        return res.status(401).json({ error: "Unauthorized Access - Invalid or Expired Token" });
                    }
                }

            } /*else if (refreshToken) {
                decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
            }*/
        } catch (err) {
            return res.status(401).json({ error: "Unauthorized Access - Invalid or Expired Token" });
        }

        const user = await User.findById(decodedToken["userId"]).select("_id username pfp");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req["user"] = user;

        next();
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default protectRoute;