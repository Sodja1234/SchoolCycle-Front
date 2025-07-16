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
<<<<<<< HEAD
     private userlocalService: UserLocalService
=======
>>>>>>> 6b7f4d9 (creation dans le service categories,  de la methode getCategories, qui recupere les categories depuis l'api)
  ) {}

  //On recupere les categories
  getCategories(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.url}categories`);
  }
<<<<<<< HEAD

  createCategorie(data: FormData) {
  const headers = this.userlocalService.getAuthHeaders();
  return this.http.post(this.url + 'categories', data, { headers });
  }
=======
>>>>>>> 6b7f4d9 (creation dans le service categories,  de la methode getCategories, qui recupere les categories depuis l'api)
}
