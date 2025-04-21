import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { routesArrayModulo1 } from '../modulo1.routes';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { SessionShared } from 'src/app/core/shared/session.shared';
import { CalendarCog, CreditCard, DollarSign, FlaskConical, Layers, Library, LucideAngularModule, MonitorCog, Tag, UserCog } from 'lucide-angular';

@Component({
  selector: 'app-config',
  imports: [LucideAngularModule, TooltipModule, RouterLink],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnInit {

  session!: SessionShared;

icons = {
  monitorCog: MonitorCog,
  dollarSign: DollarSign,
  userCog: UserCog,
  calendarCog: CalendarCog,
  library: Library,
  creditCard: CreditCard,
  flaskConical: FlaskConical,
  tag: Tag,
  layers: Layers
}

  // Routes
  routes: string[] = [];

  // Elementos de acceso
  elements: any[] = []

  constructor(
    private readonly authService: AuthService,
  ) {
    this.session = new SessionShared(this.authService);
  }

  ngOnInit(): void {
    // Rutas
    this.routes = routesArrayModulo1;

    // Elementos de acceso
    this.setElements();
  }

  //===================================================================
  // Cards
  //===================================================================
  setElements() {
    this.elements = [
      {
        route: this.routes[3],
        icon: this.icons.monitorCog,
        title: 'Gestión del sistema',
        description: 'Modifica, actualiza y configura el sistema.',
        permitRoles: [1]
      },
      {
        route: this.routes[5],
        icon: this.icons.userCog,
        title: 'Gestión de usuarios',
        description: 'Crea, edita, elimina y accede a su información detallada.',
        permitRoles: [1, 2, 3]
      },
      {
        route: this.routes[5],
        icon: this.icons.tag,
        title: 'Gestión de marcas',
        description: 'Crea, edita, elimina marcas de teléfono.',
        permitRoles: [1, 2, 3]
      },
      {
        route: this.routes[5],
        icon: this.icons.layers,
        title: 'Gestión de modelos',
        description: 'Crea, edita, elimina modelos de teléfono.',
        permitRoles: [1, 2, 3]
      },
      {
        route: this.routes[4],
        icon: this.icons.flaskConical,
        title: 'Explorador de experimentos',
        description: 'Vista esperimental.',
        permitRoles: [1]
      },
    ]
  }
}
