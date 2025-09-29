import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
  metadata?: any;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private currentUser: any = null;
  
  // Observables for real-time updates
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private roomsSubject = new BehaviorSubject<ChatRoom[]>([]);
  private typingSubject = new BehaviorSubject<{userId: string, isTyping: boolean}>({userId: '', isTyping: false});
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);

  public messages$ = this.messagesSubject.asObservable();
  public rooms$ = this.roomsSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();
  public onlineUsers$ = this.onlineUsersSubject.asObservable();

  constructor() {
    this.socket = io(environment.socketUrl || 'http://localhost:3000', {
      autoConnect: false
    });
    this.setupSocketListeners();
  }

  connect(userId: string): void {
    this.currentUser = { id: userId };
    this.socket.auth = { userId };
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
    this.currentUser = null;
  }

  private setupSocketListeners(): void {
    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    // Message events
    this.socket.on('message', (message: ChatMessage) => {
      this.addMessage(message);
    });

    this.socket.on('messages', (messages: ChatMessage[]) => {
      this.messagesSubject.next(messages);
    });

    // Room events
    this.socket.on('rooms', (rooms: ChatRoom[]) => {
      this.roomsSubject.next(rooms);
    });

    this.socket.on('roomCreated', (room: ChatRoom) => {
      const currentRooms = this.roomsSubject.value;
      this.roomsSubject.next([...currentRooms, room]);
    });

    // Typing events
    this.socket.on('typing', (data: {userId: string, isTyping: boolean}) => {
      this.typingSubject.next(data);
    });

    // Online users
    this.socket.on('onlineUsers', (users: string[]) => {
      this.onlineUsersSubject.next(users);
    });

    // Error handling
    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  // Message methods
  sendMessage(receiverId: string, message: string, type: 'text' | 'image' | 'file' = 'text', metadata?: any): void {
    const chatMessage: ChatMessage = {
      id: this.generateId(),
      senderId: this.currentUser.id,
      receiverId,
      message,
      timestamp: new Date(),
      isRead: false,
      type,
      metadata
    };

    this.socket.emit('sendMessage', chatMessage);
  }

  sendTyping(receiverId: string, isTyping: boolean): void {
    this.socket.emit('typing', { receiverId, isTyping });
  }

  markAsRead(messageId: string): void {
    this.socket.emit('markAsRead', messageId);
  }

  // Room methods
  createRoom(participants: string[]): void {
    this.socket.emit('createRoom', participants);
  }

  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', roomId);
  }

  leaveRoom(roomId: string): void {
    this.socket.emit('leaveRoom', roomId);
  }

  getRoomMessages(roomId: string): void {
    this.socket.emit('getRoomMessages', roomId);
  }

  // Utility methods
  private addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Get current user
  getCurrentUser(): any {
    return this.currentUser;
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.onlineUsersSubject.value.includes(userId);
  }

  // Get unread count for a room
  getUnreadCount(roomId: string): number {
    const room = this.roomsSubject.value.find(r => r.id === roomId);
    return room ? room.unreadCount : 0;
  }
}
