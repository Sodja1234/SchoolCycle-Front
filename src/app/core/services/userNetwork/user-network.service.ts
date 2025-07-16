import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { UserLocalService } from '../userlocal/userlocal.service';
import { PaginatedUser } from '../../models/announcement/pagination';

@Injectable({
  providedIn: 'root',
})
export class UserNetworkService {
  private url = environment.apiUrl;
  constructor(private http: HttpClient,private userlocalService : UserLocalService) {}

  getUser(page: number = 1): Observable<PaginatedUser> {
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', 10);
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.get<PaginatedUser>(this.url + 'users', { params,headers });
  }

  toggleStatusUser(id:number){
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.patch(`${this.url}user/toggle-status/${id}`,{},{ headers })
  }
}
