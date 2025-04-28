import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarService } from 'src/app/core/services/static/layout/sidebar.service';
import { SessionShared } from 'src/app/core/shared/session.shared';
import { SidebarShared } from 'src/app/core/shared/sidebar.shared';
import { Layers, Loader2, LucideAngularModule, Smartphone, Tag, Users, Users2 } from 'lucide-angular';
import { ControlService } from 'src/app/core/services/content/control.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [LucideAngularModule, NgClass, ReactiveFormsModule, FormsModule]
})
export class HomeComponent implements OnInit {

  session!: SessionShared;
  sidebar!: SidebarShared;

  icons = {
    tag: Tag,
    layers: Layers,
    device: Smartphone,
    client: Users2,
    users: Users,
    loading: Loader2
  }

  dashboardCards: any[] = [];
  isLoading = true;

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly authService: AuthService,
    private readonly controlService: ControlService,
  ) {
    this.session = new SessionShared(this.authService);
    this.sidebar = new SidebarShared(this.sidebarService);
  }


  ngOnInit(): void {
    this.controlService.getGeneralResume(this.session.id_user).subscribe({
      next: (res) => {
        const control = res.data?.control ?? [];

        // Mapeo visual con íconos y colores
        const cardConfig = [
          { denyRole: [], icon: this.icons.tag, color: 'primary', bg: 'primary/10' },
          { denyRole: [], icon: this.icons.layers, color: 'blue-500', bg: 'blue-500/10' },
          { denyRole: [], icon: this.icons.device, color: 'green-500', bg: 'green-500/10' },
          { denyRole: [], icon: this.icons.client, color: 'orange-500', bg: 'orange-500/10' },
          { denyRole: [], icon: this.icons.users, color: 'purple-500', bg: 'purple-500/10' },
        ];

        // Combinar datos de API con estilo visual
        this.dashboardCards = control.map((item: any, i: number) => ({
          ...item,
          denyRole: cardConfig[i]?.denyRole,
          icon: cardConfig[i]?.icon,
          color: cardConfig[i]?.color,
          bg: cardConfig[i]?.bg
        }));
      }
    }).add(() => {
      this.isLoading = false;
    });
  }




}
