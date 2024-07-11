// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<string | null>(null);

  getMessage(): Observable<string | null> {
    return this.messageSubject.asObservable();
  }

  showMessage(message: string) {
    this.messageSubject.next(message);
    setTimeout(() => {
      this.messageSubject.next(null);
    }, 3000); // Message will disappear after 3 seconds
  }
}
