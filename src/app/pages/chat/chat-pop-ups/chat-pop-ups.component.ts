import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../../core/services/chat/chat.service';
import { Chat } from '../../../core/models/chat/chat';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat-pop-ups',
  imports: [NgFor, FormsModule, NgIf],
  templateUrl: './chat-pop-ups.component.html',
  styleUrl: './chat-pop-ups.component.css'
})
export class ChatPopUpsComponent {
  @Input() announcementCreatorId!: number; // id du créateur de l'annonce
  @Input() announcementId!: number; // id de l'annonce (si besoin)
  isOpen = false;
  message = '';
  chatId?: number;

  messageTemplates = [
    "Bonjour, je suis intéressé(e) par votre annonce. Pouvez‑vous me donner plus d'informations ?",
    "Bonjour, l'article est‑il toujours disponible ? Merci",
    "Bonjour, quel est votre meilleur prix ? Merci",
  ];

  constructor(private chatService: ChatService, private router: Router) { }

  async openPopUpOrRedirect() {
    const userId = Number(localStorage.getItem('id'));
    if (userId === this.announcementCreatorId) {
      try {
        // Vérifie si un chat existe déjà pour cette annonce et cet utilisateur (créateur)
        const chat = await firstValueFrom(
          this.chatService.getUserChatForAnnouncement(this.announcementId!)
        );
        // Si un chat existe, redirige vers le chat
        this.router.navigate(['/chat']);
      } catch (err: any) {
        if (err.status === 404) {
          // Aucun chat existant pour cette annonce
          alert("Vous n'avez pas encore de chat pour cette annonce.");
        } else {
          alert("Une erreur est survenue.");
          console.error(err);
        }
      }
      return;
    }
    try {
      // Vérifie si un chat existe déjà pour cette annonce et cet utilisateur
      const chat = await firstValueFrom(
        this.chatService.getUserChatForAnnouncement(this.announcementId!)
      );
      // Si un chat existe, redirige vers ce chat
      this.router.navigate(['/chat']);
    } catch (err: any) {
      if (err.status === 404) {
        // Aucun chat existant, ouvrir le pop-up
        this.isOpen = true;
      } else if (err.status === 403){
        // Interdiction d'accéder à un chat avec soi-même
        alert("Vous n'avez pas encore de chat pour cette annonce.")
      }else {
        alert("Une erreur est survenue.");
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
          alert("Vous ne pouvez pas créer un chat avec vous-même.");
          this.close();
        } else if (err.status === 422) {
          alert("Impossible de créer un chat sans message.");
        } else if (err.status === 409) {
          // Si le back retourne un 409 pour "chat déjà existant", On redirige vers le chat
          this.router.navigate(['/chat']);
        } else {
          console.error(err);
        }
      }
    }
  }

}
