import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgClass, AsyncPipe } from '@angular/common';
import { SystemService } from 'src/app/core/services/system.service';
import { MenuProfileComponent } from '../menu-profile/menu-profile.component';
import { MenuService } from 'src/app/core/services/static/layout/menu-profile.service';
import { NotificationService } from 'src/app/core/services/static/layout/notification.service';
import { ChartNoAxesGantt, ChevronsUp, LucideAngularModule, Menu, User } from 'lucide-angular';
import { ModeToggleComponent } from '../../mode-toggle/mode-toggle.component';
import { SessionShared } from 'src/app/core/shared/session.shared';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [LucideAngularModule, ModeToggleComponent, NgClass, MenuProfileComponent, AsyncPipe]
})
export class NavbarComponent implements OnInit {

  session!: SessionShared;

  icons = {
    user: User,
    menu: Menu,
    chartNoAxesGrantt: ChartNoAxesGantt,
    chevronUp: ChevronsUp,
  }

  // Sidebar y rutas
  @Input() sidebarHidden!: boolean;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() routes!: string[];

  // Notificaciones
  countNotifications: number = 9;

  // Botones flotantes
  controlData: any[] = [];

  chat_whatsapp: any;
  isCheckedChatWhatsapp: boolean = false;
  chatbot: any;
  isCheckedChatBot: boolean = false;
  chat_general: any;
  isCheckedChatGeneral: boolean = false;

  // Button top
  showScrollButton: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly systemService: SystemService,
    public menuService: MenuService,
    public notificationService: NotificationService,
  ) {
    this.session = new SessionShared(this.authService);
  }

  ngOnInit(): void {
     // Detectar el scroll y mostrar/ocultar el botón
    window.addEventListener('scroll', () => {
      this.showScrollButton = window.scrollY > 100;
      this.toggleButtonOpacity(); // Controlar la opacidad del botón top
    });

    // Estado de controles
    this.statusControls();
  }

  //===================================================================
  // Sidebar
  //===================================================================
  triggerToggleSidebar() {
    this.toggleSidebar.emit();
  }

  //===================================================================
  // Notificaciones
  //===================================================================

  toggleNotifications() {
    this.notificationService.toggleNotification();
  }

  //===================================================================
  // Menu perfil
  //===================================================================

  // Mostrar / Ocultar menu de perfil
  toggleMenuProfile() {
    this.menuService.toggleMenuProfile();
  }

  //===================================================================
  // Botones flotantes
  //===================================================================

  // Obtener estado de los botones flotantes
  statusControls() {
    // Subscribirse a los datos de control
    this.systemService.controlData$.subscribe(data => {
      this.controlData = data;

      // Buscar el control de chat de whatsapp id_control 2
      this.chat_whatsapp = this.controlData.find((c: any) => c.id_control === 2);
      if (this.chat_whatsapp && this.chat_whatsapp.id_status === 1) {
        this.isCheckedChatWhatsapp = true;
      } else {
        this.isCheckedChatWhatsapp = false;
      }

      // Buscar el control de chatbot id_control 3
      this.chatbot = this.controlData.find((c: any) => c.id_control === 3);
      if (this.chatbot && this.chatbot.id_status === 1) {
        this.isCheckedChatBot = true;
      } else {
        this.isCheckedChatBot = false;
      }

      // Buscar el control de chat general id_control 4
      this.chat_general = this.controlData.find((c: any) => c.id_control === 4);
      if (this.chat_general && this.chat_general.id_status === 1) {
        this.isCheckedChatGeneral = true;
      } else {
        this.isCheckedChatGeneral = false;
      }
    });
  }

  //===================================================================
  // Boton top
  //===================================================================

  // Función para volver hacia arriba
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Transición de boton top
  toggleButtonOpacity() {
    const button = document.getElementById('btn_top');
    if (button) {
      if (this.showScrollButton) {
        button.classList.add('opacity-100');
        button.classList.remove('opacity-0');
      } else {
        button.classList.add('opacity-0');
        button.classList.remove('opacity-100');
      }
    }
  }

  //===================================================================
  // Otros
  //===================================================================

  // Evento para ocultar el menu perfil / Notificaciones
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // Verificar si se hace clic fuera del menú de perfil
    if (this.menuService.showMenuProfile$ && !(target.closest('.profile-icon') || target.closest('app-menu-profile'))) {
      this.menuService.closeMenuProfile();
    }

    // Verificar si se hace clic fuera del panel de notificaciones
    if (this.notificationService.showNotification$ && !(target.closest('.notification_button') || target.closest('app-notification'))) {
      this.notificationService.closeNotification();
    }
  }
}
