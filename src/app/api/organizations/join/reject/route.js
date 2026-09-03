import { NextResponse} from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";

export async function POST(request){
    try {

        const {join_request} = await  request.json()

        if(!join_request){
            return NextResponse.json({
                message: "Join ID is required",
                success: false
            },{status: 400})
        }

        const token = request.cookies.get("token")?.value;

        if(!token){
            return NextResponse.json({
                message: "Token is required",
                success: false
            },{status: 401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [user] = await db.query(`SELECT * FROM users WHERE id = ?`, [decoded.id])

        if(user.length === 0){
            return NextResponse.json({
                message: "User Not Found",
                success: false
            }, {status: 404})
        }
        const[request_id] = await db.query(`SELECT * FROM join_requests where id = ?`, [join_request])

        if(request_id.length === 0){
            return NextResponse.json({
                message: "Request Not Found",
                success: false
            },{status:404})
        }

        if(request_id[0].status === "REJECTED"){
            return NextResponse.json({
                message: "Already Rejected",
                success: false
            },{status:400})
        }

        if(request_id[0].status === "ACCEPTED"){
            return NextResponse.json({
                message: "Already Accepted",
                success: false
            },{status:400})
        }

        const [organization] = await db.query(
            `SELECT * FROM organizations WHERE id = ? AND created_by = ?`,
            [request_id[0].organization_id, decoded.id]
        );

        if(organization.length === 0){
            return NextResponse.json({
                message: "You are not authorized to reject this request",
                success: false
            },{status: 403})
        }

        const [update] = await db.query(`
            UPDATE join_requests
            SET status = 'REJECTED'
            WHERE id = ?
        `, [join_request]);

        const[notification] = await db.query(`INSERT INTO notifications(user_id,message,organization_id,join_request_id) VALUES(?,?,?,?)`,[request_id[0].user_id,"Your Join request has been rejected", request_id[0].organization_id, join_request])

        return NextResponse.json({
            message: "Request Rejected successfully",
            success: true,
            update
        },{status: 200})

        
    } catch (error) {
        return NextResponse.json({
            message: "Server Error",
            success: false
        },{status: 500})
    }
}
