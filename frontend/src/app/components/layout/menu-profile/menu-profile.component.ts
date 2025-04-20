import { Component, Input, OnInit } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { LogOut, LucideAngularModule, Settings, UserRoundCog, Users } from 'lucide-angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { SessionShared } from 'src/app/core/shared/session.shared';

@Component({
  selector: 'app-menu-profile',
  templateUrl: './menu-profile.component.html',
  styleUrls: ['./menu-profile.component.scss'],
  imports: [LucideAngularModule, RouterLinkActive, RouterLink]
})
export class MenuProfileComponent implements OnInit {

  session!: SessionShared;

  icons = {
    user: UserRoundCog,
    users: Users,
    settings: Settings,
    logout: LogOut
  }

  @Input() routes: string[] = [];

  menuList: any[] = [];

  constructor(
    private readonly authService: AuthService,
  ) {
    this.session = new SessionShared(this.authService);
  }

  ngOnInit(): void {
    // Inicializar la lista de elementos
    this.initList();
  }

  // ====================================================================
  // Lista de elementos
  // ====================================================================
  initList(): void {
    this.menuList = [
      {
        icon: this.icons.user,
        name: 'Perfil',
        route: this.routes[1],
      },
      {
        icon: this.icons.settings,
        name: 'Configuracion',
        route: this.routes[2],
        denyRole: [4, 5, 6],
      },
    ]
  }


  // ====================================================================
  // Cerrar Sesion
  // ====================================================================  
  logout() {
    this.authService.logoutUser();
  }

  // ====================================================================
  // Otros
  // ====================================================================

  // Mostrar elementos por role
  canShowElement(item: any): boolean {
    if (!item.denyRole || item.denyRole.length === 0) return true;
    return !item.denyRole.includes(this.session.role_user ?? -1);
  }
}
