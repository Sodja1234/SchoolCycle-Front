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
    localStorage.setItem('userSession', JSON.stringify(response));
  }

  getToken() {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) {
      return null;
    }

    const user = JSON.parse(data) as AuthLoginResponse;
    return user;
  }

  getAuthHeaders(): HttpHeaders {
    const user = this.getToken();

    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    });
  }
}
