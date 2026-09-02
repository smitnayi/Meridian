import { NextResponse } from "next/server";
import db from "@/Lib/db";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";


export async function POST(request){
    try{
        const{title,description,status,priority,due_date,assigned_to} = await request.json();

        if(!title|| !description ||!status || !priority || !due_date || !assigned_to){
            return NextResponse.json({
                success:false,
                message:"Please fill all the fields"
            },
            {status:400})
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if(!token){
            return NextResponse.json({
                success:false,
                message:"Unauthorized"
            },
            {status:401})
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode.email);

        const [user] = await db.query(`select id from users where email = ?`,[decode.email]);

        if(user.length === 0){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },
            {status:404})
        }

        const [result] = await db.query(`Insert into tasks(title,description,status,priority,due_date,assigned_to,created_by) values(?,?,?,?,?,?,?)`,[title,description,status,priority,due_date,assigned_to]);

        return NextResponse.json({
            success:true,
            message:"Task added successfully",
            result
        },{status:200})

    }catch(error){
        return NextResponse.json({
            success:false,
            message: "Something went wrong",
        },
            {status:400})
    }
}