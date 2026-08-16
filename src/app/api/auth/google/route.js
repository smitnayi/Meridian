import { NextResponse } from "next/server";


export async function GET(request){
    const clientId = process.env.GOOGLE_Client_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth`+ `?client_id=${clientId}`+`&redirect_uri=${encodeURIComponent(redirectUri)}`+`&response_type=code`+`&scope=${encodeURIComponent("openid email profile")}`;

    return NextResponse.redirect(googleUrl);
}