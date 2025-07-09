import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserLocalService } from '../userlocal/userlocal.service';
import { Observable } from 'rxjs';
import { Report } from '../../models/announcement/report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private url = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private userlocalService: UserLocalService
  ) {}

  getReport(): Observable<{ data: Report[] }> {
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.get<{ data: Report[] }>(this.url + 'reports', { headers });
  }
}
