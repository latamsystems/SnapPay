import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CookieService } from 'ngx-cookie-service';
import { Banknote, ChevronDown, CircleDollarSign, ClipboardPen, FileBadge, Home, LucideAngularModule, NotebookTabs, ScrollText, ShieldCheck, ShoppingCart, Smartphone, SquareLibrary, TableProperties, UserRoundPlus, UsersRound, Wallet } from 'lucide-angular';
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
    chevronDown: ChevronDown,
    smartPhone: Smartphone,
    usersRound: UsersRound,
    shoppingCart: ShoppingCart
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
      {
        divider: 'Gestión',
      },
      {
        icon: this.icons.usersRound,
        name: 'Clientes',
        route: this.routes[5],
        denyRole: [4, 6]
      },
      {
        icon: this.icons.smartPhone,
        name: 'Dispositivos',
        route: this.routes[4],
        denyRole: [6]
      },
      {
        icon: this.icons.shoppingCart,
        name: 'Ventas',
        route: this.routes[5],
        denyRole: [4, 6]
      },
      {
        icon: this.icons.bankNote,
        name: 'Pagos',
        route: this.routes[4],
        denyRole: [6]
      },
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
