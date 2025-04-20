import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BotMessageSquare, EarthLock, LucideAngularModule, MessageCircleDashed, MessagesSquare } from 'lucide-angular';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarService } from 'src/app/core/services/static/layout/sidebar.service';
import { SystemService } from 'src/app/core/services/system.service';
import { SidebarShared } from 'src/app/core/shared/sidebar.shared';
import { AlertDialogService } from 'src/app/lib/alert-dialog/elements/alert-dialog.service';
import { CheckboxComponent } from 'src/app/lib/checkbox/checkbox.component';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [LucideAngularModule, TooltipModule, NgClass, CheckboxComponent],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss'
})
export class SystemComponent implements OnInit, OnDestroy {

  sidebar!: SidebarShared;

  icons = {
    earthLock: EarthLock,
    messageCircleDashed: MessageCircleDashed,
    botMessageSquare: BotMessageSquare,
    messagesSquare: MessagesSquare,
  }

  // Controles
  controlData: any[] = [];

  // Checks
  maintenance: any;
  isCheckedMaintenance: boolean = false;
  chat_whatsapp: any;
  isCheckedChatWhatsapp: boolean = false;
  chatbot: any;
  isCheckedChatBot: boolean = false;
  chat_general: any;
  isCheckedChatGeneral: boolean = false;

  constructor(
    private readonly alertDialogService: AlertDialogService,
    private readonly systemService: SystemService,
    private readonly sidebarService: SidebarService,
  ) {
    this.sidebar = new SidebarShared(this.sidebarService);
  }

  ngOnInit(): void {
    // Estado de controles
    this.statusControls();

    // Inicializar datos de control
    this.systemService.updateControlData();
  }

  ngOnDestroy(): void {
      this.sidebar.destroy();
  }

  //===================================================================
  // Obtener estados de los controles
  //===================================================================
  statusControls() {
    // Subscribirse a los datos de control
    this.systemService.controlData$.subscribe(data => {
      this.controlData = data;

      // Buscar el control de mantenimiento id_control 1
      this.maintenance = this.controlData.find((c: any) => c.id_control === 1);
      if (this.maintenance && this.maintenance.id_status === 1) {
        this.isCheckedMaintenance = true;
      } else {
        this.isCheckedMaintenance = false;
      }

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
  // Cambiar estado de controles
  //===================================================================

  // Cambiar de estado
  checkUpdate(id_control: number, isCkecked: boolean) {

    // Cambiar estado del check seleccionado
    isCkecked = !isCkecked;

    // Asignar estado en numero
    let id_status;

    if (isCkecked) {
      id_status = 1;
    } else {
      id_status = 2;
    }

    this.systemService.updateControls(id_control, id_status).subscribe({
      next: (response) => {
        // console.log(response)
      }
    })
  }
}
