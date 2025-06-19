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
  constructor(private http: HttpClient, private userLocalService:UserLocalService ) {}


  //methode pour recuperer les annonces avec pagination,rechearch si possible et filtre
  getAnnouncements(
    page: number = 1, // Le numéro de la page à récupérer, par défaut 1

    search?: string, // Terme de recherche global (titre ou description)

    operation_type?: string[], // Filtre : type d'opération

    price?: number[] // Filtre : liste de prix à inclure
  ): Observable<PaginatedAnnouncements> {
    // objet HttpParams pour construire une  URL dynamique de la requête
    let params = new HttpParams().set('page', page.toString());

    // Si un terme est rechercher, on l’ajoute aux paramètres
    if (search) {
      params = params.set('search', search);
    }

    // Si un ou plusieurs types d'opération sont fournis on ajoute
    if (operation_type && operation_type.length > 0) {
      params = params.set('operation_type', operation_type.join(','));
    }

    // Si un ou plusieurs prix sont fournis on ajoute
    if (price && price.length > 0) {
      params = params.set('price', price.join(','));
    }

    // On retourne une requête HTTP GET vers l’API avec les paramètres construits
    return this.http.get<PaginatedAnnouncements>(this.url + 'announcements', {
      params,
    });
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
    const headers = this.userLocalService.getAuthHeaders();
    return this.http.post(this.url + 'announcements', data, { headers });
  }

  //methode pour modifier une annonces
  updateAnnouncement(id:number,data:any){
    const headers = this.userLocalService.getAuthHeaders()
    return this.http.put(`${this.url}announcements/${id}`, data, { headers })
  }

  //methode pour supprimer une annonce
  deleteAnnouncement(id:number){
    const  headers = this.userLocalService.getAuthHeaders();
    return this.http.delete(`${this.url}announcements/${id}`,{ headers })
  }

  //methode pour recupere les annonces similaires
  getSimilarAnnouncements(id: number): Observable<{ data: Announcement[] }> {
    return this.http.get<{ data: Announcement[] }>(
      this.url + 'announcements/' + id + '/similar'
    );
  }
  getAnnouncementUser():Observable<{data:Announcement[]}>{
    const headers =this.userLocalService.getAuthHeaders();
    return this.http.get<{data:Announcement[]}>(this.url + 'get_creator_announcement',{headers});
  }
}
