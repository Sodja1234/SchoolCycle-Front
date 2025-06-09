import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Pour rendre le service accessible globalement
})
export class MapService {
  private NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

  constructor(private http: HttpClient) {}

  // Fonction de recherche d'adresse à partir d'une chaîne de caractères
  searchPlaces(query: string): Observable<any[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('format', 'json')
      .set('addressdetails', '1')
      .set('limit', '5');

    return this.http.get<any[]>(`${this.NOMINATIM_BASE_URL}/search`, { params });
  }

  // Fonction de reverse géocodage (lat, lng => adresse)
  reverseGeocode(lat: number, lon: number): Observable<any> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('format', 'json')
      .set('addressdetails', '1');

    return this.http.get<any>(`${this.NOMINATIM_BASE_URL}/reverse`, { params });
  }
}
