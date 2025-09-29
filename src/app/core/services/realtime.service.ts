import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

export interface BookingUpdate {
  bookingId: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  timestamp: Date;
  message?: string;
  assemblerId?: string;
  customerId?: string;
}

export interface AvailabilityUpdate {
  assemblerId: string;
  date: string;
  available: boolean;
  timeSlots: string[];
  timestamp: Date;
}

export interface NotificationData {
  id: string;
  userId: string;
  type: 'booking' | 'message' | 'availability' | 'general';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private socket: Socket;
  private currentUser: any = null;

  // Observables for real-time updates
  private bookingUpdatesSubject = new BehaviorSubject<BookingUpdate[]>([]);
  private availabilityUpdatesSubject = new BehaviorSubject<AvailabilityUpdate[]>([]);
  private notificationsSubject = new BehaviorSubject<NotificationData[]>([]);
  private onlineAssemblersSubject = new BehaviorSubject<string[]>([]);

  public bookingUpdates$ = this.bookingUpdatesSubject.asObservable();
  public availabilityUpdates$ = this.availabilityUpdatesSubject.asObservable();
  public notifications$ = this.notificationsSubject.asObservable();
  public onlineAssemblers$ = this.onlineAssemblersSubject.asObservable();

  constructor() {
    this.socket = io(environment.socketUrl || 'http://localhost:3000', {
      autoConnect: false
    });
    this.setupSocketListeners();
  }

  connect(userId: string, userRole: string): void {
    this.currentUser = { id: userId, role: userRole };
    this.socket.auth = { userId, userRole };
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
    this.currentUser = null;
  }

  private setupSocketListeners(): void {
    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to real-time service');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from real-time service');
    });

    // Booking updates
    this.socket.on('bookingUpdate', (update: BookingUpdate) => {
      this.addBookingUpdate(update);
      this.showNotification({
        id: this.generateId(),
        userId: this.currentUser?.id || '',
        type: 'booking',
        title: 'Booking Update',
        message: `Booking status changed to ${update.status}`,
        data: update,
        timestamp: new Date(),
        isRead: false
      });
    });

    // Availability updates
    this.socket.on('availabilityUpdate', (update: AvailabilityUpdate) => {
      this.addAvailabilityUpdate(update);
    });

    // Notifications
    this.socket.on('notification', (notification: NotificationData) => {
      this.addNotification(notification);
    });

    // Online assemblers
    this.socket.on('onlineAssemblers', (assemblers: string[]) => {
      this.onlineAssemblersSubject.next(assemblers);
    });

    // Error handling
    this.socket.on('error', (error: any) => {
      console.error('Real-time service error:', error);
    });
  }

  // Booking methods
  updateBookingStatus(bookingId: string, status: BookingUpdate['status'], message?: string): void {
    const update: BookingUpdate = {
      bookingId,
      status,
      timestamp: new Date(),
      message,
      assemblerId: this.currentUser?.id,
      customerId: this.currentUser?.id
    };

    this.socket.emit('updateBookingStatus', update);
  }

  subscribeToBooking(bookingId: string): void {
    this.socket.emit('subscribeToBooking', bookingId);
  }

  unsubscribeFromBooking(bookingId: string): void {
    this.socket.emit('unsubscribeFromBooking', bookingId);
  }

  // Availability methods
  updateAvailability(assemblerId: string, date: string, available: boolean, timeSlots: string[]): void {
    const update: AvailabilityUpdate = {
      assemblerId,
      date,
      available,
      timeSlots,
      timestamp: new Date()
    };

    this.socket.emit('updateAvailability', update);
  }

  subscribeToAssemblerAvailability(assemblerId: string): void {
    this.socket.emit('subscribeToAvailability', assemblerId);
  }

  unsubscribeFromAssemblerAvailability(assemblerId: string): void {
    this.socket.emit('unsubscribeFromAvailability', assemblerId);
  }

  // Notification methods
  sendNotification(userId: string, type: NotificationData['type'], title: string, message: string, data?: any): void {
    const notification: NotificationData = {
      id: this.generateId(),
      userId,
      type,
      title,
      message,
      data,
      timestamp: new Date(),
      isRead: false
    };

    this.socket.emit('sendNotification', notification);
  }

  markNotificationAsRead(notificationId: string): void {
    this.socket.emit('markNotificationAsRead', notificationId);
  }

  // Utility methods
  private addBookingUpdate(update: BookingUpdate): void {
    const currentUpdates = this.bookingUpdatesSubject.value;
    this.bookingUpdatesSubject.next([...currentUpdates, update]);
  }

  private addAvailabilityUpdate(update: AvailabilityUpdate): void {
    const currentUpdates = this.availabilityUpdatesSubject.value;
    this.availabilityUpdatesSubject.next([...currentUpdates, update]);
  }

  private addNotification(notification: NotificationData): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
  }

  private showNotification(notification: NotificationData): void {
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icon-192x192.png',
        tag: notification.id
      });
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Get current user
  getCurrentUser(): any {
    return this.currentUser;
  }

  // Check if assembler is online
  isAssemblerOnline(assemblerId: string): boolean {
    return this.onlineAssemblersSubject.value.includes(assemblerId);
  }

  // Get unread notification count
  getUnreadNotificationCount(): number {
    return this.notificationsSubject.value.filter(n => !n.isRead).length;
  }
}
