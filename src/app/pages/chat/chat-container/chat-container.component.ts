import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ChatListComponent } from "../chat-list/chat-list.component";
import { ChatHeaderComponent } from "../chat-header/chat-header.component";
import { ChatMessageComponent } from "../chat-message/chat-message.component";
import { ChatInputComponent } from "../chat-input/chat-input.component";
import { ChatService } from '../../../core/services/chat/chat.service';
import { EchoService } from '../../../core/services/websocket/echo.service';
import { Chat } from '../../../core/models/chat/chat';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatInfoComponent } from '../chat-info/chat-info.component';

@Component({
  selector: 'app-chat-container',
  imports: [ChatListComponent, ChatHeaderComponent, ChatMessageComponent, ChatInputComponent, ChatInfoComponent, NgIf],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent implements OnInit, OnDestroy {

  
  userId? : number | null;
  selectedchat?: Chat;
  showInfoPanel = false;

  //Map des messages en attente par chatId
  pendingMessagesMap: { [chatId: number]: { content: string, error: boolean }[] } = {};

  // Subscriptions pour Echo
  private echoSubscription?: any;

  @ViewChild(ChatInputComponent) chatInputComponent! : ChatInputComponent;

  constructor(
    private chatService : ChatService,
    private echoService: EchoService
  ){}

  ngOnInit(): void{
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const user = JSON.parse(userSession);
      this.userId = user.id;
    } else {
      console.error('User session is not available in localStorage');
      this.userId = null;
    }
  }

  ngOnDestroy(): void {
    this.echoSubscription?.stopListening?.();
    this.echoService.disconnect();
  }



  /**
   * Gère les nouveaux messages reçus en temps réel
   */
  private handleNewMessage(message: any): void {
    // Si le message appartient au chat actuellement sélectionné
    if (this.selectedchat && message.conversation === this.selectedchat.id) {
      // Ajouter le message au chat sélectionné
      this.selectedchat.messages.push({
        id: message.id,
        content: message.content,
        conversation: message.conversation,
        sender: {
          id: message.sender.id,
          name: message.sender.name
        },
        receiver: {
          id: this.userId!,
          name: 'Utilisateur'
        },
        is_read: false,
        created_at: message.created_at,
        updated_at: message.updated_at
      });
    }

    // Mettre à jour la liste des chats pour refléter le nouveau message
    this.refreshChatList();
  }

  /**
   * Gère les mises à jour de statut des chats
   */
  private handleChatStatusUpdate(update: any): void {
    // Si le chat mis à jour est celui actuellement sélectionné
    if (this.selectedchat && update.chat_id === this.selectedchat.id) {
      this.selectedchat.is_closed = update.is_closed;
      this.selectedchat.closed_at = update.closed_at ? new Date(update.closed_at) : null;
      this.selectedchat.close_to = update.close_to ? new Date(update.close_to) : null;
    }

    // Mettre à jour la liste des chats
    this.refreshChatList();
  }

  /**
   * Rafraîchit la liste des chats
   */
  private refreshChatList(): void {
    
    
  }

  // Pour le chat courant, expose la liste des messages en attentes
  get pendingMessages(){
    return this.selectedchat?.id? this.pendingMessagesMap[this.selectedchat.id] || [] : [];
  }

  //Mettre à jour la map quand l'input change
  onPendingMessagesChange(map: { [chatId: number]: {content : string, error: boolean}[]}){
    this.pendingMessagesMap = { ...map};
  }


  onChatSelected(chat: Chat){
    // Se désabonner du chat précédent s'il y en avait un
    this.echoSubscription?.stopListening?.();
    this.chatService.getMessages(chat.id).subscribe({
      next: (messages) => {
        this.selectedchat = {...chat, messages: messages};
        // S'abonner au canal Echo du nouveau chat
        this.echoSubscription = this.echoService.listen(
          `chat.${chat.id}`,
          '.message.sent',
          (data: any) => {
            console.log('DATA MESSAGE', data);
            this.handleNewMessage(data);
          }
        );
      },
      error: (err: any) => {
        console.error("Erreur lors de la récupération des messages :", err);
      }
    });
  }

   refreshMessage() {
    if (!this.selectedchat) {
      console.error("No chat selected to refresh messages.");
      return;
    }
    this.chatService.getMessages(this.selectedchat.id).subscribe({
      next : (messages) => {
        this.selectedchat = {...this.selectedchat!, messages: messages};
      },
      error: (err) => {
        console.error("Erreur lors du rafraîchissement des messages :", err);
      }
    });

    console.log("Refreshing messages for chat:", this.selectedchat?.id);

  }

  retryPendingMessages(msg: {content: string, error: boolean}){
    this.chatInputComponent?.retrySingleMessage(this.selectedchat?.id!, msg);
  }

  onChatClosed() {
    // Rafraîchir les messages pour refléter l'état fermé
    if (this.selectedchat) {
      this.refreshMessage();
    }
  }

  // Méthode appelée par le header pour ouvrir le panneau info
  openInfoPanel() {
    this.showInfoPanel = true;
  }
  // Méthode pour fermer le panneau info
  closeInfoPanel() {
    this.showInfoPanel = false;
  }
}
