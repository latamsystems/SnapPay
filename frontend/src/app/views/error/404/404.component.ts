import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JButtonComponent } from 'src/app/lib/button/button.component';
import { ModeToggleComponent } from 'src/app/components/mode-toggle/mode-toggle.component';

@Component({
  selector: 'app-404',
  imports: [ModeToggleComponent, JButtonComponent],
  templateUrl: './404.component.html',
  styleUrl: './404.component.scss'
})
export class Error404Component {

  constructor(private readonly router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
