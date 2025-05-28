import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Announcement } from '../../models/announcement/announcement';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private url = environment.apiUrl;
  constructor(private http : HttpClient) { }

  //methode pour recuperer les annonces
  getAnnouncements(): Observable<{ data: Announcement }> {
    const announcements = this.http.get<{ data: Announcement }>(this.url + 'announcements');
    return announcements;
  }

}
