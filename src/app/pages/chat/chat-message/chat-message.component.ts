import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chat } from '../../../core/models/chat/chat';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  imports: [NgFor, NgIf],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent implements OnInit {
  @Input() chat? : Chat;
  @Input() pendingMessages: { content: string, error: boolean}[] = [];
  @Output() retry = new EventEmitter<{content: string, error: boolean}>();
  

  userId? : number;
  constructor(){}
  ngOnInit(): void {
      const idString = localStorage.getItem('id');
      const id = idString !== null? Number(idString): null;
      if(id !== null && !isNaN(id)){
        this.userId = id;
      }else{
        console.error("User ID n'est pas un nombre valide");
      }
  }

  retryPendingMessages(msg: {content: string, error: boolean}){
    this.retry.emit(msg);
  }
  

}
