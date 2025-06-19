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

  getUser() {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) {
      return null;
    }

    const user = JSON.parse(data) as AuthLoginResponse;
    return user;
  }

  getAuthHeaders(): HttpHeaders {
    const user = this.getUser();

    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${user?.token}`,
    });
  }
}
