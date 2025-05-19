import { Component } from '@angular/core';
import { ChatListComponent } from "../chat-list/chat-list.component";
import { ChatHeaderComponent } from "../chat-header/chat-header.component";
import { ChatMessageComponent } from "../chat-message/chat-message.component";
import { ChatInputComponent } from "../chat-input/chat-input.component";

@Component({
  selector: 'app-chat-container',
  imports: [ChatListComponent, ChatHeaderComponent, ChatMessageComponent, ChatInputComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent {

}
