import { NextResponse } from "next/server";
import db from "@/Lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const { name, description, company_name } = await request.json();

        if (!name || !company_name || !description) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ALL_FIELDS_REQUIRED"
                },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();

        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "UNAUTHORIZED_ACCESS",
                    token
                },
                { status: 401 }
            );
        }

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const [user] = await db.query(
            `SELECT id FROM users WHERE email = ?`,
            [decode.email]
        );

        if (user.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "USER_NOT_FOUND"
                },
                { status: 404 }
            );
        }

        const invite_code = Math.floor(
            100000 + Math.random() * 900000
        );

        const [create] = await db.query(
            `INSERT INTO organizations
            (name, description, company_name, invite_code, created_by)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                description,
                company_name,
                invite_code,
                user[0].id
            ]
        );

        return NextResponse.json(
            {
                success: true,
                message: "ORG_CREATED_SUCCESSFULLY",
                organization_id: create.insertId,
                invite_code: invite_code,
                created_by: user[0].id
            },
            { status: 201 }
        );

    } catch (error) {

        console.error("CREATE ORGANIZATION ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "INTERNAL_SERVER_ERROR"
            },
            { status: 500 }
        );
    }
}