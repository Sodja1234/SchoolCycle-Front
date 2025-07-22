import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../../core/services/chat/chat.service';
import { Chat } from '../../../core/models/chat/chat';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat-pop-ups',
  imports: [NgFor, FormsModule, NgIf, NgClass],
  templateUrl: './chat-pop-ups.component.html',
  styleUrl: './chat-pop-ups.component.css'
})
export class ChatPopUpsComponent {
  @Input() announcementCreatorId!: number; // id du créateur de l'annonce
  @Input() announcementId!: number; // id de l'annonce (si besoin)
  isOpen = false;
  message = '';
  chatId?: number;
  userId?: number | null;

  messageTemplates = [
    "Bonjour, je suis intéressé(e) par votre annonce. Pouvez‑vous me donner plus d'informations ?",
    "Bonjour, l'article est‑il toujours disponible ? Merci",
    "Bonjour, quel est votre meilleur prix ? Merci",
  ];

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(private chatService: ChatService, private router: Router) { }
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

  async openPopUpOrRedirect() {
    if (this.userId === this.announcementCreatorId) {
      console.log(true);
      try {
        const chat = await firstValueFrom(
          this.chatService.getUserChatForAnnouncement(this.announcementId!)
        );
        // Si un chat existe, redirige vers le chat
        this.router.navigate(['/chat']);
      } catch (err: any) {
        if (err.status === 404) {
          this.showToastMessage("Vous n'avez pas encore de chat pour cette annonce.", 'error');
          // NE PAS rediriger
        } else if (err.status === 403) {
          this.showToastMessage("Le créateur ne peut pas avoir de chat avec lui-même.", 'error');
          // NE PAS rediriger
        } else {
          this.showToastMessage("Une erreur est survenue.", 'error');
          console.error(err);
        }
      }
      return;
    }

    // Pour les autres utilisateurs
    try {
      const chat = await firstValueFrom(
        this.chatService.getUserChatForAnnouncement(this.announcementId!)
      );
      // Si un chat existe, redirige vers ce chat
      this.router.navigate(['/chat']);
    } catch (err: any) {
      if (err.status === 404) {
        // Aucun chat existant, ouvrir le pop-up
        this.isOpen = true;
      } else if (err.status === 403) {
        this.showToastMessage("Vous n'avez pas encore de chat pour cette annonce.", 'error');
        // NE PAS rediriger
      } else {
        this.showToastMessage("Une erreur est survenue.", 'error');
        console.error(err);
      }
    }
  }

  close() {
    this.isOpen = false;
  }

  selectTemplate(template: string) {
    this.message = template;
  }

  async send() {
    if (this.message.trim()) {
      try {
        const chat = await firstValueFrom(
          this.chatService.createChatWithMessage(this.announcementId!, this.message)
        );
        this.close();
        this.router.navigate(['/chat']);
      } catch (err: any) {
        if (err.status === 403) {
          this.showToastMessage("Vous ne pouvez pas créer un chat avec vous-même.", 'error');
          this.close();
        } else if (err.status === 422) {
          this.showToastMessage("Impossible de créer un chat sans message.", 'error');
        } else if (err.status === 409) {
          this.router.navigate(['/chat']);
        } else {
          this.showToastMessage("Une erreur est survenue.", 'error');
          console.error(err);
        }
      }
    }
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, duration);
  }

}
