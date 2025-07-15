import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface WebSocketMessage {
  event: string;
  data: any;
  channel?: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  conversation: number;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ChatStatusUpdate {
  chat_id: number;
  action: string;
  is_closed: boolean;
  closed_at?: string;
  close_to?: string;
  announcement_id: number;
  created_by: number;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 seconde

  // Subjects pour les différents types de messages
  private messageSubject = new Subject<ChatMessage>();
  private chatStatusSubject = new Subject<ChatStatusUpdate>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  // Observables publics
  public messages$ = this.messageSubject.asObservable();
  public chatStatusUpdates$ = this.chatStatusSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {}

  /**
   * Initialise la connexion WebSocket
   */
  public connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = environment.wsUrl || 'ws://localhost:8080';
        this.socket = new WebSocket(`${wsUrl}?token=${token}`);

        this.socket.onopen = () => {
          console.log('WebSocket connecté');
          console.log('URL de connexion:', `${wsUrl}?token=${token}`);
          this.connectionStatusSubject.next(true);
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.socket.onclose = (event) => {
          console.log('WebSocket déconnecté:', event.code, event.reason);
          this.connectionStatusSubject.next(false);
          this.handleReconnect();
        };

        this.socket.onerror = (error) => {
          console.error('Erreur WebSocket:', error);
          console.error('URL tentée:', `${wsUrl}?token=${token}`);
          reject(error);
        };

      } catch (error) {
        console.error('Erreur lors de la connexion WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Gère la reconnexion automatique
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        const token = this.getAuthToken();
        if (token) {
          this.connect(token).catch(error => {
            console.error('Échec de la reconnexion:', error);
          });
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
    }
  }

  /**
   * Traite les messages reçus
   */
  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      
      switch (message.event) {
        case 'message.sent':
          this.messageSubject.next(message.data as ChatMessage);
          break;
        case 'chat.status.changed':
          this.chatStatusSubject.next(message.data as ChatStatusUpdate);
          break;
        default:
          console.log('Événement non géré:', message.event);
      }
    } catch (error) {
      console.error('Erreur lors du parsing du message:', error);
    }
  }

  /**
   * S'abonne à un canal de chat
   */
  public subscribeToChat(chatId: number): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        event: 'subscribe',
        channel: `private-chat.${chatId}`
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  /**
   * Se désabonne d'un canal de chat
   */
  public unsubscribeFromChat(chatId: number): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        event: 'unsubscribe',
        channel: `private-chat.${chatId}`
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  /**
   * S'abonne aux mises à jour de l'utilisateur
   */
  public subscribeToUser(userId: number): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        event: 'subscribe',
        channel: `private-user.${userId}`
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  /**
   * Se désabonne des mises à jour de l'utilisateur
   */
  public unsubscribeFromUser(userId: number): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        event: 'unsubscribe',
        channel: `private-user.${userId}`
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  /**
   * Déconnecte le WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connectionStatusSubject.next(false);
    }
  }

  /**
   * Récupère le token d'authentification
   */
  private getAuthToken(): string | null {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const user = JSON.parse(userSession);
      return user.token;
    }
    return null;
  }

  /**
   * Vérifie si la connexion est active
   */
  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
} 