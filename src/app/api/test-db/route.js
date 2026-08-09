import { NextResponse } from "next/server";
import db from "@/Lib/db";

export async function GET() {
    try {
        const [result] = await db.query("SELECT 1 AS connected");

        return NextResponse.json({
            success: true,
            message: "Database connected successfully",
            result,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Database connection failed",
            },
            { status: 500 }
        );
    }
}