import { User } from "../user";
import { Category } from "./category";
import { Photo } from "./photo";

export interface Announcement {
    id : number;
    title: string;
    description: string;
    operation_type: string,
    price: number;
    is_completed: number;
    is_cancelled: number;
    exchange_location_address: string;
    exchange_location_lng : string;
    exchange_location_lat : string;
    category : Category;
    photos : Photo[];
    created_by : User;
    created_at : string;
    updated_at : string;
}

