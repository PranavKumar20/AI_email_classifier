import { NextResponse } from "next/server";

export async function GET(request){ 
    console.log("passed throough test");
    return NextResponse.json({ message: "Hello from Next.js" }, { status: 200 });
};