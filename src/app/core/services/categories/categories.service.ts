import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserLocalService } from '../userlocal/userlocal.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private url = environment.apiUrl;
  constructor(
    private http: HttpClient,
  ) {}

  //On recupere les categories
  getCategories(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.url}categories`);
  }
}
