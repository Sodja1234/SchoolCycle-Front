import { Component, Input } from '@angular/core';
import { Chat } from '../../../core/models/chat/chat';

@Component({
  selector: 'app-chat-header',
  imports: [],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {

  chats : Chat[] = []; //liste des conversations

  @Input() chat?: Chat; //Conversation active
  @Input() userId!: number;

  getInitials(name: string): string | undefined{
    if(!name){
      return undefined;
    }
    const initials = name
      .split('')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    return initials;
  }
  getOtherParticipantName(): string{
    if (!this.chat) return '';
    if (this.chat.posted_by.created_by === this.userId) {
      const firstMsg = this.chat.messages[0];
      return firstMsg ? firstMsg.sender.name : 'Utilisateur inconnu';
    }
    return this.chat.posted_by.name;
  }

}
