export interface Report {
  id : number;
  user_id: number;
  announcement_id: number;
  motif: string;
  detail?: string;
  created_at:string
}
