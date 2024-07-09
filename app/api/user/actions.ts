
//User
'use server'
import prisma from '@/app/libs/prismadb';
import { ObjectId } from 'mongodb';

function isNewUser(uId: string): boolean{
    
    //for some reason, when the user is first created, at the signin callback, the user id is a number (observed for github) but when they sign in again, it converts into a user.id 

    //so to check if they are new, we check if their uid is a valid objectid
    if (ObjectId.isValid(uId)){
        return true
    } else {
        return false
    }
}

function isUserIsInFamily(uId: string): boolean{

    if (isNewUser(uId)){
        return false
    }

    //other logic here

    return true

}



export async function getUserIdFromEmail(email: string): Promise<string | null> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase(), // Ensure case-insensitive search if needed
            },
            select: {
                id: true,
            },
        });

        return user?.id || null; // Return userId if found, otherwise null
    } catch (error) {
        console.error(`Error fetching user by email ${email}:`, error);
        throw new Error(`Failed to fetch user by email ${email}: ${error.message}`);
    }
}