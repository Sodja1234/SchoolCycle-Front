import { User } from "../user";
import { Category } from "./category";
import { Photo } from "./photo";

export interface Announcement {
    id : number;
    title: string;
    description: string;
    operation_type: string,
    state:string
    price: number;
    is_completed: boolean;
    is_cancelled: boolean;
    exchange_location_address: string;
    exchange_location_lng : string;
    exchange_location_lat : string;
    category : Category;
    photos : Photo[];
    created_by : User;
    created_at : string;
    updated_at : string;
    //utilisable pour la comparaison dans le single-component
    created_at_raw:string;
    updated_at_raw:string
}

