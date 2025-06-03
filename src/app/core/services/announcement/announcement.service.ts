import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Announcement } from '../../models/announcement/announcement';
import { Category } from '../../models/announcement/category';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient) {}

  //methode pour recuperer les annonces
  getAnnouncements(): Observable<{ data: Announcement[] }> {
    const announcements = this.http.get<{ data: Announcement[] }>(
      this.url + 'announcements'
    );
    return announcements;
  }

  getAnnoucement(id: number): Observable<Announcement> {
    return this.http.get<Announcement>(this.url + 'announcements/' + id);
  }

  //On recupere les categories
  getCategories(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.url}categories`);
  }
}
