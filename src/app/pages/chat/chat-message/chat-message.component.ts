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
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        const user = JSON.parse(userSession);
        this.userId = user.id;
      } else {
        console.error("User session is not available in localStorage");
      }
  }

  retryPendingMessages(msg: {content: string, error: boolean}){
    this.retry.emit(msg);
  }
  

}
