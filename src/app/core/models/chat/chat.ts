import { Message } from "./message";

export interface Chat {
    id: number;
    created_by: number;
    posted_by:{
        title: string;
        created_by: number;
        name: string;
    };
    is_closed: boolean;
    closed_at?: Date | null;
    close_to? : Date | null;
    messages : Message[];
}
