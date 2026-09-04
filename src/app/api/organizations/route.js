import { NextResponse } from "next/server";
import db from "@/Lib/db";
import jwt from "jsonwebtoken";

export async function GET(request) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({
                message: "Token is required",
                success: false
            }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [user] = await db.query(
            `SELECT id FROM users WHERE id = ?`,
            [decoded.id]
        );

        if (user.length === 0) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        const [organizations] = await db.query(`
            SELECT 
                o.*,
                COALESCE(MAX(om.role), IF(o.created_by = ?, 'Owner / Leader', 'Member')) AS role
            FROM organizations o
            LEFT JOIN organization_members om
                ON o.id = om.organization_id AND om.user_id = ?
            WHERE o.created_by = ? OR om.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [decoded.id, decoded.id, decoded.id, decoded.id]);

        return NextResponse.json({
            message: "Organizations fetched successfully",
            success: true,
            organizations
        }, { status: 200 });

    } catch (error) {
        console.log(error);

        return NextResponse.json({
            message: "Something went wrong",
            success: false
        }, { status: 500 });
    }
}