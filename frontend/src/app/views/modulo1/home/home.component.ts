import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarService } from 'src/app/core/services/static/layout/sidebar.service';
import { SessionShared } from 'src/app/core/shared/session.shared';
import { SidebarShared } from 'src/app/core/shared/sidebar.shared';
import { Layers, LucideAngularModule, Smartphone, Tag, Users, Users2 } from 'lucide-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule, FormsModule]
})
export class HomeComponent {

  session!: SessionShared;
  sidebar!: SidebarShared;

  icons = {
    users: Users,
    tag: Tag,
    layers: Layers,
    device: Smartphone,
    client: Users2
  }

  constructor(
    private readonly authService: AuthService,
    private readonly sidebarService: SidebarService
  ) {
    this.session = new SessionShared(this.authService);
    this.sidebar = new SidebarShared(this.sidebarService);
  }








}
