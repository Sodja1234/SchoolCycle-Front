import { Component, EventEmitter, Output, Input } from '@angular/core';
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
  imports: [FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  /**
   * ID de la conversation active
   */
  @Input() conversation?: number;

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
    if (!content || !this.conversation) return;

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
