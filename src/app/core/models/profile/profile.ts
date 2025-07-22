import { User } from "../user";

export interface Profile{
    id: number,
    user:User,
    bio:string,
    telephone:string,
    avatar:string,
    adresse:string,
    profession:string
}

export interface PutPassword{
    old_password:string,
    new_password:string,
    password_confirmation:string
}