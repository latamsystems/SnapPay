import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Wrench } from 'lucide-angular';
import { interval, Subscription, switchMap } from 'rxjs';
import { routesArray } from 'src/app/app.routes';
import { SystemService } from 'src/app/core/services/system.service';

@Component({
  selector: 'app-maintenance',
  imports: [LucideAngularModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit, AfterViewInit, OnDestroy {

  icons = {
    wrench: Wrench,
  }

  private checkServerSubscription!: Subscription;

  constructor(
    private readonly systemService: SystemService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.checkServerSubscription = interval(10000) // Verifica cada 10 segundos
      .pipe(
        switchMap(() => this.systemService.checkServerStatus())
      )
      .subscribe((isServerUp: boolean) => {
        if (isServerUp) {
          this.router.navigate([routesArray[1]]); // Redirige al login si el servidor está activo
          this.checkServerSubscription.unsubscribe(); // Detener las verificaciones cuando el servidor está arriba
        }
      });
  }

  ngOnDestroy(): void {
    if (this.checkServerSubscription) {
      this.checkServerSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    const interBubble = document.querySelector('.interactive') as HTMLElement;
    if (interBubble) {
      let curX = 0;
      let curY = 0;
      let tgX = 0;
      let tgY = 0;

      const move = () => {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(move);
      };

      window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
      });

      move();
    }
  }
}
