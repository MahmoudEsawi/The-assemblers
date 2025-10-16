import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage, ChatRoom } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() receiverId: number = 0;
  @Input() receiverName: string = '';
  @Output() closeChat = new EventEmitter<void>();

  messages: ChatMessage[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  typingTimeout: any;
  isOnline: boolean = false;
  currentRoom: ChatRoom | null = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.receiverId) {
      this.initializeChat();
    }
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  private initializeChat(): void {
    // Subscribe to messages
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });

    // Subscribe to typing status
    this.chatService.typing$.subscribe(typing => {
      if (typing.userId === this.receiverId.toString()) {
        this.isTyping = typing.isTyping;
      }
    });

    // Subscribe to online status
    this.chatService.onlineUsers$.subscribe(users => {
      this.isOnline = users.includes(this.receiverId.toString());
    });

    // Create or join room
    this.createOrJoinRoom();
  }

  private createOrJoinRoom(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      // Create room with both users
      this.chatService.createRoom([currentUser.id.toString(), this.receiverId.toString()]);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.receiverId) {
      this.chatService.sendMessage(this.receiverId.toString(), this.newMessage.trim());
      this.newMessage = '';
      this.stopTyping();
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else {
      this.startTyping();
    }
  }

  private startTyping(): void {
    if (!this.isTyping) {
      this.chatService.sendTyping(this.receiverId.toString(), true);
      this.isTyping = true;
    }

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Set new timeout to stop typing
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 1000);
  }

  private stopTyping(): void {
    if (this.isTyping) {
      this.chatService.sendTyping(this.receiverId.toString(), false);
      this.isTyping = false;
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  isMyMessage(message: ChatMessage): boolean {
    return message.senderId === this.authService.currentUser?.id.toString();
  }

  close(): void {
    this.closeChat.emit();
  }
}
