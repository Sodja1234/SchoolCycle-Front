import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first, firstValueFrom, Observable } from 'rxjs';
import { Chat } from '../../models/chat/chat';
import { Message } from '../../models/chat/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAuthToken(){
    const userSession = localStorage.getItem('userSession');
    let token = null;
    
    if (userSession) {
      const user = JSON.parse(userSession);
      token = user.token;
    }
    
    const headers = new HttpHeaders({
      Authorization : `Bearer ${token}`
    });
    return headers;
  }

  //Récupération des chats de l'utilisateur connecté
  getChats() : Observable<Chat[]>{
    const headers = this.getAuthToken();
    return this.http.get<Chat[]>(this.baseUrl + 'my-chats', {headers});
  }

  //Récuperer ou créer un chat pour une annonce
  getOrcreateChat(posted_by : number): Observable<Chat> {
    const headers = this.getAuthToken();
    return this.http.get<Chat>(`${this.baseUrl}announcements/${posted_by}/chats}`, { headers });
  }

  //Envoyer un message
  sendMessage(conversation : number, content : string){
    const body = {content};
    return this.http.post<Message>(`${this.baseUrl}chats/${conversation}/messages`, body, {
      headers: this.getAuthToken()
    });
  }

  //Récupérer les messages d'une conversation
  getMessages(conversation : number): Observable<Message[]> {
    const headers = this.getAuthToken();
    return this.http.get<Message[]>(`${this.baseUrl}chats/${conversation}/messages`, { headers });
  }

  //Cloturer une conversation
  closeConversation(conversation: number): Observable<Chat> {
    const headers = this.getAuthToken();
    return this.http.delete<Chat>(`${this.baseUrl}chats/${conversation}`, { headers });
  }

  //Méthode asynchrone pour l'envoie des messages 
  async sendMessageAsync(conversation: number, content: string): Promise<Message>{
    return await firstValueFrom(this.sendMessage(conversation, content));
  }

  //Récuperer le chat existant pour l'utilisateur connecté et une annonce donnée
  getUserChatForAnnouncement(announcementId: number): Observable<Chat>{
    const headers = this.getAuthToken();
    return this.http.get<Chat>(`${this.baseUrl}announcements/${announcementId}/user-chat`, { headers });
  }

  // Créer un chat pour une annonce et envoyer le premier message
  createChatWithMessage(announcementId: number, content: string): Observable<Chat>{
    const headers = this.getAuthToken();
    return this.http.post<Chat>(
      `${this.baseUrl}announcements/${announcementId}/chats`,
      { content }, { headers } 
    );
  }

  // Fermer un chat (marquer comme terminé)
  closeChat(chatId: number): Observable<any>{
    const headers = this.getAuthToken();
    return this.http.post<any>(
      `${this.baseUrl}chats/${chatId}/close`,
      {}, { headers } 
    );
  }

  //Récuperer les informations de contact pour un chat
  getContactInfo(chatId: number): Observable<any>{
    const headers = this.getAuthToken();
    return this.http.get<any>(`${this.baseUrl}chats/${chatId}/contact-info`, { headers });
  }

}
