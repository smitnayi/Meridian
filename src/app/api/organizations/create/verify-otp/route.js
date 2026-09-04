import { NextResponse } from "next/server";
import db from "@/Lib/db";


export async function POST(request){
    try{
        const {otp} = await request.json();

        if(!otp){
            return NextResponse.json({
                message: "OTP is required"
            }, {status: 400})
        }


        const [organizations] = await db.query(`SELECT * FROM organizations WHERE invite_code = ?`,[otp]);

        if(organizations.length === 0){
            return NextResponse.json({
                message: "Invalid OTP",
                success: false
            },{status: 400})
        }

        return NextResponse.json({
            success: true,
            message: "ORGANIZATION FOUND",
            organization: organizations[0]
        }, {status: 200})
        
        
    }catch(error){
        console.log(error);

        return NextResponse.json({
            message: "Something went wrong"
        }, {status:500})
    }
}