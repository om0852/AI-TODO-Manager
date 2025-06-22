import { db } from "@/lib/db";
import { workspaces } from "@/lib/schema";
import { NextRequest } from "next/server";



export async function GET(request:NextRequest){

    try {
        const data =  db.select(workspaces)
    } catch (error) {
        
    }




}