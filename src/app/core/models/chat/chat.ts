import { Message } from "./message";

export interface Chat {
    id: number;
    created_by: number;
    posted_by:{
        id: number;
        title: string;
        created_by: string; //Non d'utilisateur
    };
    is_closed: boolean;
    closed_at?: Date | null;
    close_to? : Date | null;
    messages : Message[];
}
