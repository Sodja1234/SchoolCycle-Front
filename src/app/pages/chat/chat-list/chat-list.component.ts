import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chat } from '../../../core/models/chat/chat';
import { User } from '../../../core/models/user';
import { ChatService } from '../../../core/services/chat/chat.service';
import { EchoService } from '../../../core/services/websocket/echo.service';

@Component({
  selector: 'app-chat-list',
  imports: [NgFor, NgIf, CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent implements OnInit {
  @Input() userId!: number;
  @Output() chatSelected = new EventEmitter<Chat>();
  chats : Chat[] = [];
  users : User[] = [];

  pendingMessages: {content: string, error: boolean}[] = [];

  constructor(private chatservice: ChatService, private echoService: EchoService){}

  ngOnInit(): void {
      this.chatservice.getChats().subscribe({
        next: (data: any) => {
          console.log('DATA CHATS', data);
          this.chats = Array.isArray(data) ? data : data.data;
          this.listenToAllChats();
        },
        error : (err) => console.error('Erreur de chargement des chats', err),
      });
  }

  private chatListeners: any[] = [];

  private listenToAllChats() {
    // Nettoie les anciens listeners
    this.chatListeners.forEach(listener => listener?.stopListening?.());
    this.chatListeners = [];
    this.chats.forEach(chat => {
      const listener = this.echoService.listen(`chat.${chat.id}`, 'message.sent', (data: any) => {
        // Rafraîchit la liste des chats à chaque nouveau message
        this.chatservice.getChats().subscribe({
          next: (data: any) => {
            console.log('DATA CHATS (refresh)', data);
            this.chats = Array.isArray(data) ? data : data.data;
          },
          error : (err) => console.error('Erreur de rafraîchissement des chats', err),
        });
      });
      this.chatListeners.push(listener);
    });
  }

  ngOnDestroy(): void {
    this.chatListeners.forEach(listener => listener?.stopListening?.());
  }

  getUserNamebyId(id : number): string{
    const user = this.users.find(user => user.id === id);
    return user ? user.name : `Utilisteur #${id}`;
  }

  getInitials(name: string): string | undefined {
    if (!name) {
      return undefined;
    }
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    return initials;
  }

  getOtherParticipant(chat: Chat): string{
    // Si l'utilisateur connecté est le créateur de l'annonce
    if (chat.posted_by.id === this.userId){
      const firstMsg = chat.messages[0];
      return firstMsg ? firstMsg.sender.name : 'Utilisateur inconnu';
    }

    // Sinon, c'est le nom de l'utilisateur qui a créé l'annonce
    return chat.posted_by.created_by;
  }

  getLastMessageContent(chat: Chat): string {
    if (chat.messages && chat.messages.length > 0) {
      return chat.messages[chat.messages.length - 1].content;
    }
    return 'Aucun message';
  }

  getLastMessageTime(chat: Chat): string {
    if (chat.messages && chat.messages.length > 0) {
      return chat.messages[chat.messages.length - 1].created_at;
    }
    return '';
  }
}
