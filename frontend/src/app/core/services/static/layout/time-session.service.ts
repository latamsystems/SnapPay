import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeSesionService {

  private readonly expSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  private countdownSubscription: Subscription | null = null;

  constructor() { }

  startCountdown(expTimestamp: number): void {
    this.stopCountdown();
    this.updateTimeRemaining(expTimestamp); // Calcula el tiempo restante inmediatamente

    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateTimeRemaining(expTimestamp);
    });
  }

  private updateTimeRemaining(expTimestamp: number): void {
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos desde el epoch
    const timeRemaining = expTimestamp - currentTime;

    if (timeRemaining > 0) {
      this.expSubject.next(timeRemaining);
    } else {
      this.stopCountdown();
      this.expSubject.next(0);
    }
  }

  stopCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.countdownSubscription = null;
    }
  }

  resetCountdown(): void {
    console.log('Resetting countdown');
    this.stopCountdown();
    this.expSubject.next(null); // Reiniciar el contador estableciendo el valor a null
  }

  getRemainingTime(): BehaviorSubject<number | null> {
    return this.expSubject;
  }

}
