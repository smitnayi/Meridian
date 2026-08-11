import {NextResponse} from "next/server";
import db from "@/Lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


async function POST(request){
    try{
        const {email,password} = await request.json();

        if(!email,!password){
            return NextResponse.json({
                success:false,
                message:"Please fill all the fields"
            },{status:400})
        }

        const [user] = await db.query(`Select email from users where email = ?`,[email]);


        if(user.length === 0){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:400})
        }

        const passwordMatch = await bcrypt.compare(password,user[0].password);

        if(!passwordMatch){
            return NextResponse.json({
                success:false,
                message:"Invalid credentials"
            },{status:400})
        }

        const token = jwt.sign({email:user[0].email},process.env.JWT_SECRET,{expiresIn:"7d"});

        return NextResponse.json({
            success:true,
            message:"Login successful",
            token
        },{status:200})

    }catch(error){
        return NextResponse.json({
            success:false,
            message:"Something went wrong",
            error
        },{status:500})
    }
}