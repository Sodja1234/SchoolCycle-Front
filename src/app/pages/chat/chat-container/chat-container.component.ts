import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatListComponent } from "../chat-list/chat-list.component";
import { ChatHeaderComponent } from "../chat-header/chat-header.component";
import { ChatMessageComponent } from "../chat-message/chat-message.component";
import { ChatInputComponent } from "../chat-input/chat-input.component";
import { ChatService } from '../../../core/services/chat/chat.service';
import { Chat } from '../../../core/models/chat/chat';

@Component({
  selector: 'app-chat-container',
  imports: [ChatListComponent, ChatHeaderComponent, ChatMessageComponent, ChatInputComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent implements OnInit {

  
  userId? : number | null;
  selectedchat?: Chat;

  //Map des messages en attente par chatId
  pendingMessagesMap: { [chatId: number]: { content: string, error: boolean }[] } = {};

  @ViewChild(ChatInputComponent) chatInputComponent! : ChatInputComponent;

  constructor(private chatService : ChatService){}

  ngOnInit(): void{
    const idString = localStorage.getItem('id');
    const id = idString !== null ? Number(idString) : null;
    if (id !== null && !isNaN(id)){
      this.userId = id;
    }else{
      console.error('User ID is not available in localStorage');
      this.userId = null;
    }
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
    this.chatService.getMessages(chat.id).subscribe({
      next: (messages) => {
        this.selectedchat = {...chat, messages: messages};
      },
      error: (err) => {
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
}
