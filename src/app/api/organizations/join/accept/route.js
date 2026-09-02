import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt, { decode } from "jsonwebtoken";

export async function POST(request){
    try{
        const {join_request}= await request.json();

        if(!join_request){
            return NextResponse.json({
                message: "Join Request is required",
                success: false
            },{status:400})
        }

        const token = request.cookies.get("token")?.value;

        if(!token){
            return NextResponse.json({
                message: "Authorization token is missing",
                success:false
            },{status:400})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        console.log("DECODDE",decoded)

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

        if(request_id[0].status === "ACCEPTED"){
            return NextResponse.json({
                message: "Already Accepted",
                success: false
            },{status:400})
        }

        if(request_id[0].status === "REJECTED"){
            return NextResponse.json({
                message: "Already Rejected",
                success: false
            },{status:400})
        }

        const [organization] = await db.query(`Select * FROM organizations WHERE id = ? and created_by = ?`,[request_id[0].organization_id,decoded.id]);

        if(organization.length ===  0){
            return NextResponse.json({
                message: "You are not authorized to accept this request",
                success: false
            },{status:403})
        }


        const [member] = await db.query(`Insert Into organization_members (organization_id,user_id,role) VALUES (?,?,?)`,[request_id[0].organization_id,request_id[0].user_id,'MEMBER'])

        const [updateJoinRequest] = await db.query(`UPDATE join_requests SET status = 'ACCEPTED' WHERE id = ?`,[join_request])

        return NextResponse.json({
            message: "Request Accepted successfully",
            success: true,
            member,
            updateJoinRequest
        },{status:200})

    }catch(error){
        console.log(error)
        return NextResponse.json({
            message: "Server Error",
            success: false
        }, { status:500})
    }
}