import { Injectable } from '@angular/core';
import { AuthLoginResponse } from '../../models/auth/auth';
import { HttpHeaders } from '@angular/common/http';

const SESSION_KEY = 'userSession';

@Injectable({
  providedIn: 'root',
})
export class UserLocalService {
  constructor() {}

  stockerUserLocal(response: AuthLoginResponse): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(response));
  }

  getUser(): AuthLoginResponse | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) as AuthLoginResponse : null;
  }

  isAuthenticated(): boolean {
    return !!this.getUser()?.token;
  }

  getAuthHeaders(): HttpHeaders {
    const user = this.getUser();
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${user?.token}`,
    });
  }

}
