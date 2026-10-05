import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth/jwt";

export async function requireAuth(req:Request, res:Response, next:NextFunction) {
    
    const token = req.cookies.token;    
    if(!token){
        return res.status(401).json({error:"Unauthorized"});
    }

   try {
     const payload = verifyToken(token);
     (req as any).user = payload;
     next()


   } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
   }
}