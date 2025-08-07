import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserLocalService } from '../userlocal/userlocal.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Category} from '../../models/announcement/category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private url = environment.apiUrl;
  constructor(
    private http: HttpClient,
     private userlocalService: UserLocalService
  ) {}

  //On recupere les categories
  getCategories(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.url}categories`);
  }

  //recuperer les categories les plus utilisées
  getMostUsedCategories():Observable<{ data : Category[] }>{
    return this.http.get<{data : Category[]}>(this.url + 'categories/most_used')
  }

  createCategorie(data: FormData) {
  const headers = this.userlocalService.getAuthHeaders();
  return this.http.post(this.url + 'categories', data, { headers });
  }

  updateCategorie(id:number,data:FormData){
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.put(`${this.url}categories/${id}`, data, {headers})
  }
}
