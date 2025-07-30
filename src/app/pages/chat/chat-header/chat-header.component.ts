import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Chat } from '../../../core/models/chat/chat';
import { ChatService } from '../../../core/services/chat/chat.service';
import { firstValueFrom } from 'rxjs';
import { EchoService } from '../../../core/services/websocket/echo.service';

@Component({
  selector: 'app-chat-header',
  imports: [NgIf, NgClass],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {

  chats : Chat[] = []; //liste des conversations

  @Input() chat?: Chat; //Conversation active
  @Input() userId!: number;
  @Output() chatClosed = new EventEmitter<void>();
  @Output() openInfo = new EventEmitter<void>();

  private statusListener: any;

  constructor(private chatService: ChatService, private echoService: EchoService) {}

  ngOnInit(): void {
    if (this.chat) {
      this.statusListener = this.echoService.listen(`chat.${this.chat.id}`, 'chat.status.changed', (data: any) => {
        if (this.chat) {
          this.chat.is_closed = data.is_closed;
          this.chat.closed_at = data.closed_at;
          this.chat.close_to = data.close_to;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.statusListener?.stopListening?.();
  }

  // Debug pour voir si le chat est reçu
  ngOnChanges() {
    
  }

  // Vérifier si l'utilisateur connecté est le créateur de l'annonce
  isAnnouncementCreator(): boolean {
    return this.chat?.posted_by.id === this.userId;
  }


  // Toast & Modal
  isCloseModalOpen: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showSimpleToast: boolean = false;

  // Vérifier si le chat est fermé
  isChatClosed(): boolean {
    return this.chat?.is_closed || false;
  }

  // Afficher le toast
  showToast(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
    this.toastMessage = message;
    this.toastType = type;
    this.showSimpleToast = true;
    setTimeout(() => this.showSimpleToast = false, duration);
  }

  // Ouvrir le modal de confirmation
  openCloseModal() {
    this.isCloseModalOpen = true;
  }

  // Fermer le modal
  closeCloseModal() {
    this.isCloseModalOpen = false;
  }

  // Méthode appelée après confirmation
  async confirmCloseChat() {
    if (!this.chat) return;
    try {
      await firstValueFrom(this.chatService.closeChat(this.chat.id));
      this.chatClosed.emit();
      this.showToast('Annonce marquée comme terminée avec succès !', 'success');
    } catch (error: any) {
      if (error.status === 409) {
        this.showToast('Cette annonce a déjà été marquée comme terminée.', 'error');
      } else {
        this.showToast('Erreur lors de la fermeture du chat : ' + (error.error?.message || 'Erreur inconnue'), 'error');
      }
    }
    this.closeCloseModal();
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
