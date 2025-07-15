import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FormsModule } from '@angular/forms';


/***
 * Interface pour le message en attent
 */
interface PendingMessage{
  content: string; //Contenu du message
  error : boolean; //Indique si le message a une erreur
}

@Component({
  selector: 'app-chat-input',
  imports: [FormsModule, NgIf],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  /**
   * ID de la conversation active
   */
  @Input() conversation?: number;

  /**
   * Indique si le chat est fermé
   */
  @Input() isChatClosed: boolean = false;

  /**
   * Evenement émis lorsqu'un message est envoyé avec succès 
   */
  @Output() messageSent = new EventEmitter<void>();

  /**
   * Evenement émis à chaque mise à jour des messages en attente
   */
  @Output() pendingMessagesChange = new EventEmitter<{ [chatId: number] : PendingMessage[]}>();

  messageContent: string = ''; //Contenu du message à envoyer

  /**
   * Indique si un message est en cours d'envoi
   */
  isSending: boolean = false;

  /**
   * Map contenant les messages en attente d'envoi
   * La clé est l'ID de la conversation et la valeur est un tableau de messages en attente
   */
  pendingMessagesMap: { [chatId: number]: PendingMessage[]} = {};

  constructor(private chatService: ChatService){}

  /**
   * Mis à jour des messages en attente en émettant l'état actuel au parent
   * 
   */
  private updatePendingMessages(): void{
    this.pendingMessagesChange.emit({ ...this.pendingMessagesMap});
  }

  /**
   * Envoie du message, on ajoute d'abord le message en attente localement puis on tente l'envoi
   * En cas de succès, le messsage est retiré de la liste. Sinon il est marqué en erreur
   */

    async sendMessage(): Promise<void> {
    const content = this.messageContent.trim();
    
    // Validation : vérifier qu'il y a du contenu et une conversation sélectionnée
    if (!content) {
      console.warn('Tentative d\'envoi d\'un message vide');
      return;
    }
    
    if (!this.conversation) {
      console.warn('Tentative d\'envoi d\'un message sans conversation sélectionnée');
      return;
    }

    if (this.isChatClosed) {
      console.warn('Tentative d\'envoi d\'un message dans un chat fermé');
      alert('Impossible d\'envoyer un message dans une conversation fermée');
      return;
    }

    this.isSending = true;

    if (!this.pendingMessagesMap[this.conversation]) {
      this.pendingMessagesMap[this.conversation] = [];
    }

    this.pendingMessagesMap[this.conversation].push({ content, error: false });
    this.updatePendingMessages();
    this.messageContent = '';

    try {
      await this.chatService.sendMessageAsync(this.conversation!, content);
      this.pendingMessagesMap[this.conversation] =
        this.pendingMessagesMap[this.conversation].filter(m => m.content !== content);
      this.updatePendingMessages();
      this.messageSent.emit();
    } catch (err) {
      const msg = this.pendingMessagesMap[this.conversation].find(m => m.content === content);
      if (msg) msg.error = true;
      this.updatePendingMessages();
    } finally {
      this.isSending = false;
    }
  }

  /**
   * Ajuste la hauteur du textarea automatiquement
   * @param event événement d'input
   */
  adjustTextareaHeight(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  /**
   * Gère l'appui sur la touche Entrée
   * @param event événement keydown
   */
  onEnterPress(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Réessayer l'envoi d'un message spécifique
   * @param chatId id de la conversation
   * @param msg le message à réessayer
   */

    async retrySingleMessage(chatId: number, msg: PendingMessage): Promise<void> {
    try {
      await this.chatService.sendMessageAsync(chatId, msg.content);
      this.pendingMessagesMap[chatId] =
        this.pendingMessagesMap[chatId].filter(m => m.content !== msg.content);
      this.updatePendingMessages();
      this.messageSent.emit();
    } catch {
      // Échec de ré-envoi : on ne modifie pas l'état
    }
  }

}
