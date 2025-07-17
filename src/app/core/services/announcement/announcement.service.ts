import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Announcement } from '../../models/announcement/announcement';
import { Category } from '../../models/announcement/category';
import { PaginatedAnnouncements } from '../../models/announcement/pagination';
import { UserLocalService } from '../userlocal/userlocal.service';
import { FavoriteStateService } from '../favorite/favorite.service';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient,private userlocalService : UserLocalService, private favoriteState : FavoriteStateService) {}


  //methode de recuperation et filtrage des annonces
  getAnnouncements(id?: number, page: number = 1, filters: any = {}): Observable<PaginatedAnnouncements> {

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

    // Filtrage par état (ex: new, like_new, used)
    if (Array.isArray(filters.state) && filters.state.length) {
      params = params.set('state', filters.state.join(','));
    }

    // Filtrage par prix minimum
    if (filters.min_price != null) {
      params = params.set('min_price', filters.min_price);
    }

    // Filtrage par prix maximum
    if (filters.max_price != null) {
      params = params.set('max_price', filters.max_price);
    }

    // Tri par champ
    if (filters.sort_field) {
      params = params.set('sort_field', filters.sort_field);
    }

    // Direction du tri
    if (filters.sort_direction) {
      params = params.set('sort_direction', filters.sort_direction);
    }

    // ✅ Filtrage par is_completed
    if (filters.is_completed != null) {
      params = params.set('is_completed', filters.is_completed);
    }

    // ✅ Filtrage par is_cancelled
    if (filters.is_cancelled != null) {
      params = params.set('is_cancelled', filters.is_cancelled);
    }

    // Construction de l'URL en fonction de la présence d'un ID
    let url = this.url + 'announcements/public';
    if (id) {
      url += `/${id}`; // Ajoute l'ID utilisateur si présent
    }

    // Envoi de la requête HTTP GET avec les paramètres construits
    return this.http.get<PaginatedAnnouncements>(url, { params });
    return this.http.get<PaginatedAnnouncements>(url, { params });
  }




  //methode pour recuperer une annonce en particulier
  getAnnoucement(id: number): Observable<Announcement> {
    //on fait une requete http vers l'api  avec l'id de l'annonce passéé en parametre
    return this.http.get<Announcement>(this.url + 'announcement/public/single/' + id);
    return this.http.get<Announcement>(this.url + 'announcement/public/single/' + id);
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

  
   getAnnouncementFavorite():Observable<{data:Announcement[]}>{
    const headers=this.userlocalService.getAuthHeaders();
    return this.http.get<{data:Announcement[]}>(this.url + 'my_favorites',{headers})
  }

  // Méthode ajoutée pour signaler une annonce
reportAnnouncement(payload: {
  user_id: number;
  announcement_id: number;
  motif: string;
  detail?: string;
}): Observable<any> {
  const headers = this.userlocalService.getAuthHeaders();
  return this.http.post(`${this.url}reports`, payload, { headers });
}

   // la methode pour ajouter ou retiré une annonce en favoris
  toggleFavorite(announcementId: number) {
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.post(`${this.url}favorites/${announcementId}`, {}, {headers}).pipe(
      // Utilisation de tap pour mettre à jour l'état du favori dans le service
      tap((res: any) => {
        this.favoriteState.setFavorite(announcementId, res.is_favorite);
      })
    );
  }

  // Methode pour verifier si une annonce est en favoris
  checkFavorite(announcementId: number) {
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.get(`${this.url}favorites/${announcementId}/check`, {headers}).pipe(
      tap((res: any) => {
        this.favoriteState.setFavorite(announcementId, res.is_favorite);
      })
    );
  }

  // la méthode pour charger tous les favoris en une seule requête
  loadAllFavorites() {
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.get<number[]>(`${this.url}favorites`, {headers}).pipe(
      tap(favoriteIds => {
        // Transforme le tableau d'IDs en un objet pour initialiser l'état des favoris
        // reduce est utilisé pour créer un objet où chaque clé est un ID d'annonce et la valeur est true
        const favoritesMap = favoriteIds.reduce((acc, id) => ({...acc, [id]: true}), {});
        this.favoriteState.initializeFavorites(favoritesMap);
      })
    );
  }


}
