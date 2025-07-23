import { Injectable, OnDestroy } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../../environments/environment';

// Correction : rendre Pusher global pour Echo
(window as any).Pusher = Pusher;

@Injectable({
  providedIn: 'root'
})
export class EchoService implements OnDestroy {
  private echo: Echo<any>;

  constructor() {
    const token = this.getToken();
    console.log("Echo token", token);
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.reverbKey,
      wsHost: '127.0.0.1',
      wsPort: 8080,
      wssPort: 8080,
      forceTLS: false,
      encrypted: false,
      disableStats: true,
      enabledTransports: ['ws'],
      authEndpoint: environment.apiUrl.replace(/\/$/, '') + '/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      // Pour Laravel Reverb, cluster n'est pas nécessaire
      cluster: ''
    });
  }

  /**
   * Écoute un événement sur un canal privé
   * @param channel nom du canal (ex: 'chat.1')
   * @param event nom de l'événement (ex: 'message.sent')
   * @param callback fonction à appeler lors de la réception
   */
  listen(channel: string, event: string, callback: (data: any) => void) {
    return this.echo.private(channel).listen(event, (data: any) => {
      console.log(`[ECHO] Event reçu sur ${channel} :`, event, data);
      callback(data);
    });
  }

  /**
   * Déconnexion propre d'Echo
   */
  disconnect() {
    this.echo.disconnect();
  }

  leave(channel: string) {
    this.echo.leave(channel);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  /**
   * Récupération du token Bearer depuis localStorage
   */
  private getToken(): string | null {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const user = JSON.parse(userSession);
      return user.token;
    }
    return null;
  }
} 