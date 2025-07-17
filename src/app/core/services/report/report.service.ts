import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserLocalService } from '../userlocal/userlocal.service';
import { Observable } from 'rxjs';
import { Report } from '../../models/announcement/report';
import { PaginatedReport } from '../../models/announcement/pagination';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private url = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private userlocalService: UserLocalService
  ) {}

  getReport(page: number = 1,): Observable<PaginatedReport> {
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', 12);
    const headers = this.userlocalService.getAuthHeaders();
    return this.http.get<PaginatedReport>(this.url + 'reports', {params,headers });
  }
}
