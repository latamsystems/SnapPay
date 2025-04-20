import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CookieService } from 'ngx-cookie-service';
import { Banknote, ChevronDown, CircleDollarSign, ClipboardPen, FileBadge, Home, LucideAngularModule, NotebookTabs, ScrollText, ShieldCheck, SquareLibrary, TableProperties, UserRoundPlus, Wallet } from 'lucide-angular';
import { SessionShared } from 'src/app/core/shared/session.shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [LucideAngularModule, NgClass, RouterLink, RouterLinkActive, TooltipModule],
  animations: [
    trigger('slideToggle', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*'
      })),
      transition('collapsed <=> expanded', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {

  session!: SessionShared;

  icons = {
    home: Home,
    clipboardPen: ClipboardPen,
    userRoundPlus: UserRoundPlus,
    scrollText: ScrollText,
    squareLibrery: SquareLibrary,
    fileBadge: FileBadge,
    notebookTabs: NotebookTabs,
    wallet: Wallet,
    circleDollarSign: CircleDollarSign,
    bankNote: Banknote,
    shieldCheck: ShieldCheck,
    tableProperties: TableProperties,
    chevronDown: ChevronDown
  }

  @Input() title!: string;
  @Input() sidebarHidden!: boolean;
  @Input() routes!: string[];

  // Elementos de lista
  elementList: { [key: string]: boolean } = {};
  menuList: any[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService
  ) {
    this.session = new SessionShared(this.authService);
  }

  ngOnInit(): void {
    // Inicializar la lista de elementos
    this.initList();

    // Cargar estado de las secciones desde las cookies
    const savedElementList = this.cookieService.get('elementList');
    if (savedElementList) {
      this.elementList = JSON.parse(savedElementList);
    }
  }

  // ====================================================================
  // Lista de elementos
  // ====================================================================
  initList(): void {
    this.menuList = [
      {
        icon: this.icons.home,
        name: 'Inicio',
        route: this.routes[0],
      },
      // {
      //   divider: 'Secretaría',
      // },
      // {
      //   icon: this.icons.clipboardPen,
      //   name: 'Matrículas',
      //   denyRole: [4, 6],
      //   elements: [
      //     {
      //       icon: this.icons.userRoundPlus,
      //       name: 'Regístrar',
      //       route: this.routes[3],
      //       denyRole: [4]
      //     },
      //     {
      //       icon: this.icons.scrollText,
      //       name: 'Matriculados',
      //       route: this.routes[15],
      //     }
      //   ]
      // },
      // { // Solo para rol de consultor (4)
      //   icon: this.icons.scrollText,
      //   name: 'Matriculados',
      //   route: this.routes[15],
      //   denyRole: [1, 2, 3, 5, 6]
      // },
      // {
      //   icon: this.icons.squareLibrery,
      //   name: 'Expedientes Académicos',
      //   route: this.routes[4],
      //   denyRole: [6]
      // },
      // {
      //   icon: this.icons.fileBadge,
      //   name: 'Certificado de cupo',
      //   route: this.routes[5],
      //   denyRole: [4, 6]
      // },
      // {
      //   icon: this.icons.notebookTabs,
      //   name: 'Nóminas',
      //   route: this.routes[6],
      //   denyRole: [6]
      // },
      // {
      //   divider: 'Colecturía',
      // },
      // {
      //   icon: this.icons.circleDollarSign,
      //   name: 'Pagos',
      //   denyRole: [3, 4, 5, 6],
      //   elements: [
      //     {
      //       icon: this.icons.bankNote,
      //       name: 'Regístro Pagos',
      //       route: this.routes[7],
      //       denyRole: [4, 6]
      //     },
      //     {
      //       icon: this.icons.shieldCheck,
      //       name: 'Validar Pagos',
      //       route: this.routes[8],
      //       denyRole: [3, 4, 5, 6]
      //     }
      //   ]
      // },
      // {
      //   icon: this.icons.bankNote,
      //   name: 'Regístro Pagos',
      //   route: this.routes[7],
      //   denyRole: [1, 2, 4, 6]
      // },
      // {
      //   icon: this.icons.wallet,
      //   name: 'Cartera de cobro',
      //   route: this.routes[9],
      //   denyRole: [6]
      // },
      // {
      //   icon: this.icons.tableProperties,
      //   name: 'Tarifario',
      //   route: this.routes[10],
      //   denyRole: [6]
      // }
    ]
  }

  // ====================================================================
  // Funciones para elementos en lista
  // ====================================================================
  toggleSection(sectionKey: string): void {
    this.elementList[sectionKey] = !this.elementList[sectionKey];
    this.saveElementListToCookies();
  }

  isSectionVisible(sectionKey: string): boolean {
    return !!this.elementList[sectionKey];
  }

  // Guardar el estado de elementList en cookies
  private saveElementListToCookies(): void {
    this.cookieService.set('elementList', JSON.stringify(this.elementList));
  }

  // Mostrar elementos por role
  canShowElement(item: any): boolean {
    if (!item.denyRole || item.denyRole.length === 0) return true;
    return !item.denyRole.includes(this.session.role_user ?? -1);
  }

  // ====================================================================
  // Mostrar seccion de autors
  // ====================================================================
  get opacityClass(): string {
    return this.sidebarHidden ? 'opacity-0 transition-[opacity] duration-100' : 'opacity-100 transition-[opacity] duration-1000';
  }
}
