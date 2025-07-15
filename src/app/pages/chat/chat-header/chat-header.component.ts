import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { Chat } from '../../../core/models/chat/chat';
import { ChatService } from '../../../core/services/chat/chat.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat-header',
  imports: [NgIf],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {

  chats : Chat[] = []; //liste des conversations

  @Input() chat?: Chat; //Conversation active
  @Input() userId!: number;
  @Output() chatClosed = new EventEmitter<void>();
  @Output() openInfo = new EventEmitter<void>();

  constructor(private chatService: ChatService) {}

  // Debug pour voir si le chat est reçu
  ngOnChanges() {
    
  }

  // Vérifier si l'utilisateur connecté est le créateur de l'annonce
  isAnnouncementCreator(): boolean {
    return this.chat?.posted_by.id === this.userId;
  }

  // Vérifier si le chat est fermé
  isChatClosed(): boolean {
    return this.chat?.is_closed || false;
  }

  // Marquer comme terminé
  async markAsCompleted(): Promise<void> {
    if (!this.chat) return;

    try {
      await firstValueFrom(this.chatService.closeChat(this.chat.id));
      this.chatClosed.emit();
      alert('Annonce marquée comme terminée avec succès !');
    } catch (error: any) {
      if (error.status === 409) {
        alert('Cette annonce a déjà été marquée comme terminée.');
      } else {
        alert('Erreur lors de la fermeture du chat : ' + (error.error?.message || 'Erreur inconnue'));
      }
    }
  }

  onOpenInfo() {
    this.openInfo.emit();
  }

  getInitials(name: string): string | undefined{
    if(!name){
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
  getOtherParticipantName(): string{
    if (!this.chat) return '';
    
    // Si l'utilisateur connecté est le créateur de l'annonce
    if (this.chat.posted_by.id === this.userId) {
      const firstMsg = this.chat.messages[0];
      return firstMsg ? firstMsg.sender.name : 'Utilisateur inconnu';
    }
    
    // Sinon, c'est le nom de l'utilisateur qui a créé l'annonce
    return this.chat.posted_by.created_by;
  }

}
