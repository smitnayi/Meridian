import { NextResponse } from "next/server";

export async function GET(request){
    const clientId =process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI

    const githubURL = `https://github.com/login/oauth/authorize`+`?client_id=${clientId}` + `&redirect_uri=${encodeURIComponent(redirectUri)}`+`&scope=${encodeURIComponent("read:user user:email")}`;


    return NextResponse.redirect(githubURL);
}
