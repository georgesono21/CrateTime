
//User
'use server'
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



