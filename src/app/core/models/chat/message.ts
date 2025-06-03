export interface Message {
    id : number;
    conversation : number;
    content : string;
    sender : {
        id : number;
        name : string
    };
    receiver : {
        id : number;
        name : string
    };
    is_read : boolean;
    created_at : string;
    updated_at : string;
}
