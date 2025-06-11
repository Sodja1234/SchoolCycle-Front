import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Announcement } from '../../models/announcement/announcement';
import { Category } from '../../models/announcement/category';
import { PaginatedAnnouncements } from '../../models/announcement/pagination';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient) {}

  //function pour recuperer le token de l'utilisateur connecté
  authToken(){
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return headers;
  }  
  
  //methode pour recuperer les annonces avec pagination
  getAnnouncements(page : number = 1): Observable<PaginatedAnnouncements> {
    //on fait une requete http vers l'api  avec le numero de la page en parametre 
    //si aucun numero e page est fournie, le numero par defaut est 1
    const announcements = this.http.get<PaginatedAnnouncements>(this.url + 'announcements?page=' + page);
    //on retourne un observable du type PaginatedAnnouncements
    return announcements;
  }

  //methode pour recuperer une annonce en particulier 
  getAnnoucement(id: number): Observable<Announcement> {
    //on fait une requete http vers l'api  avec l'id de l'annonce passéé en parametre
    return this.http.get<Announcement>(this.url + 'announcements/' + id);
  }

  //On recupere les categories
  getCategories(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.url}categories`);
  }
  
  //methode pour ajouter une annonce
  createAnnouncement(data : FormData){
    const headers = this.authToken();
    return this.http.post(this.url + 'announcements', data, { headers });
  }
}
