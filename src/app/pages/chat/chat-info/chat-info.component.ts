import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChatService } from '../../../core/services/chat/chat.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrl: './chat-info.component.css',
  standalone: true,
  imports: [NgIf, NgFor]
})
export class ChatInfoComponent implements OnInit {
  @Input() chatId!: number;
  @Output() close = new EventEmitter<void>();

  loading = false;
  error: string | null = null;
  contact: any = null;
  history: any[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    if (this.chatId) {
      this.fetchInfo();
    }
  }

  fetchInfo() {
    this.loading = true;
    this.error = null;
    this.chatService.getContactInfo(this.chatId).subscribe({
      next: (data) => {
        this.contact = data.contact;
        this.history = data.history;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Impossible de charger les informations du contact.";
        this.loading = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
