import { User } from "../user";
import { Announcement } from "./announcement";

export interface Report {
  id : number;
  user: User;
  announcement: Announcement;
  motif: string;
  detail?: string;
  created_at:string
}
