import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { TimeSesionService } from 'src/app/core/services/static/layout/time-session.service';
import { Clock, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-alert-session',
  templateUrl: './alert-session.component.html',
  styleUrls: ['./alert-session.component.scss'],
  imports: [NgClass, LucideAngularModule]
})
export class AlertSessionComponent implements OnInit, OnDestroy {

  icons = {
    clock: Clock
  }

  @Input() sidebarHidden!: boolean;

  timeRemaining: number | null = null;
  private subscription!: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly timeSesionService: TimeSesionService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.timeSesionService.getRemainingTime().subscribe(time => {
      this.timeRemaining = time;
      if (time === 0) {
        // Cuando el tiempo restante llega a 0, cerrar sesión
        this.authService.logoutUser();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Renovar token
  renewToken(): void {
    console.log('Renewing token');
    this.authService.renewTokenUser();
  }

  // Dar formato al timer
  formatTime(seconds: number | null): string {
    if (seconds === null) return ''; // Manejar caso de null

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
