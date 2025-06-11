import {Announcement} from './announcement';

export interface PaginatedAnnouncements{
  data : Announcement [];
  links : PaginationUrls;
  meta : PaginationMeta
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationUrls {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}