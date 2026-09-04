import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";

export async function GET(request){
    try{

        const token = request.cookies.get("token")?.value;

        if(!token){
            return NextResponse.json({
                message: "Token is required",
                success: false
            },{status: 401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await db.query(`SELECT * FROM users WHERE id = ?`, [decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: "User not found",
                success: false
            }, {status: 404})
        }

        const [notification] = await db.query(`SELECT n.*,u.first_name,u.last_name,u.email FROM notifications n LEFT JOIN join_requests jr ON n.join_request_id = jr.id LEFT JOIN users u ON jr.user_id = u.id WHERE n.user_id = ? AND n.is_read = false`,[decoded.id])
        
        if(notification.length === 0){
        return NextResponse.json({
            message: "No notifications found",
            success: true,
            notification: []
        }, {status: 200});
    }

        return NextResponse.json({
            message: "Notifications Fetched Successfully",
            success: true,
            notification
        },{status: 200})

    }catch(error){
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, {status: 500});
    }
}