import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chat } from '../../../core/models/chat/chat';
import { User } from '../../../core/models/user';
import { ChatService } from '../../../core/services/chat/chat.service';

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

  constructor(private chatservice: ChatService){}

  ngOnInit(): void {
      this.chatservice.getChats().subscribe({
        next: (data) => {this.chats = data; console.log('Chats reçu  :', this.chats );},
        error : (err) => console.error('Erreur de chargement des chats', err),
      });
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
    if (chat.posted_by.created_by === this.userId){
      const firstMsg = chat.messages[0];

      return firstMsg ? firstMsg.sender.name : 'Utilisateur inconnu';
    }

    return chat.posted_by.name;
  }
}
