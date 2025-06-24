import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Announcement } from '../../models/announcement/announcement';
import { Category } from '../../models/announcement/category';
import { PaginatedAnnouncements } from '../../models/announcement/pagination';
import { UserLocalService } from '../userlocal/userlocal.service';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient,private userlocalService : UserLocalService) {}


  //methode de recuperation et filtrage des annonces
  getAnnouncements(page: number = 1, filters: any = {}): Observable<PaginatedAnnouncements> {
    // Définition des paramètres de base : page actuelle et nombre d’éléments par page
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', 12);

    // 🔍 Filtrage par mot-clé de recherche (titre ou description)
    if (filters.search) {
      params = params.set('search', filters.search);
    }

    // Filtrage par type d’opération (ex: sale, exchange, don)
    if (Array.isArray(filters.operation_type) && filters.operation_type.length) {
      params = params.set('operation_type', filters.operation_type.join(','));
    }

    //  Filtrage par état (ex: new, like_new, used)
    if (Array.isArray(filters.state) && filters.state.length) {
      params = params.set('state', filters.state.join(','));
    }

    //  Filtrage par prix minimum
    if (filters.min_price != null) {
      params = params.set('min_price', filters.min_price);
    }

    //  Filtrage par prix maximum
    if (filters.max_price != null) {
      params = params.set('max_price', filters.max_price);
    }

    // Tri par champ spécifique si présent (ex: created_at, title, etc.)
    if (filters.sort_field) {
      params = params.set('sort_field', filters.sort_field);
    }

    //  Direction du tri (ascendant ou descendant)
    if (filters.sort_direction) {
      params = params.set('sort_direction', filters.sort_direction);
    }

    // Envoi de la requête HTTP GET avec les paramètres construits
    return this.http.get<PaginatedAnnouncements>(this.url + 'announcements', { params });
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
  createAnnouncement(data: FormData) {
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.post(this.url + 'announcements', data, { headers });
  }

  //methode pour modifier une annonces
  updateAnnouncement(id:number,data:any){
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.put(`${this.url}announcements/${id}`, data, { headers })
  }

  //methode pour supprimer une annonce
  deleteAnnouncement(id:number){
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.delete(`${this.url}announcements/${id}`,{ headers })
  }

  //methode pour recupere les annonces similaires
  getSimilarAnnouncements(id: number): Observable<{ data: Announcement[] }> {
    return this.http.get<{ data: Announcement[] }>(
      this.url + 'announcements/' + id + '/similar'
    );
  }
  getAnnouncementUser():Observable<{data:Announcement[]}>{
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.get<{data:Announcement[]}>(this.url + 'get_creator_announcement',{headers});
  }
}
