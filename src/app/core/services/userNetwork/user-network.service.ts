import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { UserLocalService } from '../userlocal/userlocal.service';

@Injectable({
  providedIn: 'root',
})
export class UserNetworkService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient,private userlocalService : UserLocalService) {}

  getUser(): Observable<{ data: User[] }> {
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.get<{ data: User[] }>(this.url + 'users', { headers });
  }
}
