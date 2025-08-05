import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Profile, PutPassword } from '../../models/profile/profile';
import { Observable, map } from 'rxjs';
import { UserLocalService } from '../userlocal/userlocal.service';
import { Category } from '../../models/announcement/category';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private userLocalService: UserLocalService
  ) { }

  getProfileTutor(): Observable<{ data: Profile }> {
    const headers = this.userLocalService.getAuthHeaders();
    return this.http.get<{ data: Profile }>(this.baseUrl + 'tutors/get', { headers });
  }

  updateProfile(formdata: FormData): Observable<Profile> {
    
    
    const headers = this.userLocalService.getAuthHeaders();
    return this.http.post<Profile>(this.baseUrl + 'tutors/update?_method=PUT', formdata, { headers });
  }

  updateUserPassword(data: PutPassword) {
    const user = this.userLocalService.getUser();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    });

    return this.http.put(this.baseUrl + 'users/update-password', data, { headers });
  }

  updateName(formdata:FormData){
    const headers = this.userLocalService.getAuthHeaders();
    return this.http.post<Profile>(this.baseUrl + 'users/update?_method=PUT', formdata, { headers });
  }


getPreferences(): Observable<Category[]> {
  const headers =this.userLocalService.getAuthHeaders();
  return this.http.get<{ data: Category[] }>(this.baseUrl +'preferences').pipe(
    map(res => res.data)
  );
}

getCategories(): Observable<Category[]> {
  const headers =this.userLocalService.getAuthHeaders();
  return this.http.get<{ data: Category[] }>(this.baseUrl +'categories').pipe(
    map(res => res.data)
  );
}
savePreferences(categoryIds: number[]): Observable<any> {
  const headers =this.userLocalService.getAuthHeaders();
  return this.http.post(this.baseUrl +'preferences', { category_ids: categoryIds }, {headers});
}
  
}
