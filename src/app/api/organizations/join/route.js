import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken"

export async function POST(request){
    try{
        const {organization_id} = await request.json();

        if(!organization_id){
            return NextResponse.json({
                message: "Organization ID is required"
            }, {status: 400})
        }

        const [organizations] = await db.query(`SELECT * FROM organizations WHERE id = ?`, [organization_id])

        if(organizations.length === 0){
            return NextResponse.json({
                message: "Organization not found"
            }, {status: 404})
        }

        const token = request.cookies.get('token')?.value

        if(!token){
            return NextResponse.json({
                message: "Token is required"
            }, {status: 401})
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [user] = await db.query(`Select * FROM users WHERE id = ?`, [decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: "User not found"
            }, {status: 404})
        }

        const [joinRequest]= await db.query(`INSERT INTO join_requests (organization_id,user_id,status) VALUES (?,?,?)`,[organization_id, decoded.id, 'pending']) 

        const [notifications] = await db.query(`INSERT INTO notifications (user_id,message,organization_id,join_request_id) VALUES(?,?,?,?)`,[organizations[0].created_by, "A new user has requested to join your organization",organization_id,joinRequest.insertId])

        return NextResponse.json({
            message: "Request has been sent to organization admin",
            success: true,
            //organization: organizations[0],
            //users: user[0]
            joinRequest
        }, {status: 200})

    }catch(error){
        console.log(error)
        return NextResponse.json({
            message: "Something went wrong",
            success: false
        }, {status: 500})
    }
}