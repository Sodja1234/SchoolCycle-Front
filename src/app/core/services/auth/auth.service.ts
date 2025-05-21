import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthLoginData, AuthLoginResponse} from '../../models/auth/auth';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //@TODO : Supprimer la variable url et creer un fichier d'environnement
  private url = environment.apiUrl;

  constructor(private http : HttpClient) { }

  /**
   * Envoie les informations de connexion à l’API et attend une réponse typée AuthLoginResponse.
   * @param data Les informations de connexion (email + mot de passe)
   * @returns Observable<AuthLoginResponse> contenant le token, nom, email, etc.
   */
  login(data: AuthLoginData): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(this.url + 'login', data);
  }
}
