import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Profile, PutPassword } from '../../models/profile/profile';
import { Observable } from 'rxjs';
import { UserLocalService } from '../userlocal/userlocal.service';

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

}
