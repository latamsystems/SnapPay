 
// ===============================================
// Librería de Componentes y Funciones - tailjNg
// ===============================================
// Descripción:
//   Esta librería está diseñada para ofrecer un conjunto de componentes reutilizables y funciones
//   optimizadas para facilitar el desarrollo de interfaces de usuario y la gestión de datos en aplicaciones 
//   web. Incluye herramientas para mejorar la experiencia del desarrollador y la interacción con el usuario.
// Propósito:
//   - Crear componentes modulares y personalizables.
//   - Mejorar la eficiencia del desarrollo front-end mediante herramientas reutilizables.
//   - Proporcionar soluciones escalables y fáciles de integrar con aplicaciones existentes.
// Uso:
//   Para obtener la funcionalidad completa, simplemente importa los módulos necesarios y usa los 
//   componentes según tu caso de uso. Asegúrate de revisar la documentación oficial para obtener ejemplos 
//   detallados sobre su implementación y personalización.
// Autores:
//   Armando Josue Velasquez Delgado - Desarrollador principal
// Licencia:
//   Este proyecto está licenciado bajo la MIT - ver el archivo LICENSE para más detalles.
// Versión: 0.0.9
// Fecha de creación: 2025-01-04
// =============================================== 


import { Component, inject, computed, Input } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { LucideAngularModule, CircleCheck, CircleX, TriangleAlert, Info, CircleHelp, Loader2, } from "lucide-angular";
import { NgClass } from "@angular/common";
import { JButtonComponent } from "src/app/lib/button/button.component";
import { AlertDialogService } from "src/app/lib/alert-dialog/elements/alert-dialog.service";
import { JColorsService } from "src/app/lib/colors/colors.service";

@Component({
  selector: "JAlertDialog",
  imports: [LucideAngularModule, NgClass, JButtonComponent],
  templateUrl: "./alert-dialog.component.html",
  styleUrl: "./alert-dialog.component.scss",
  animations: [
    trigger("modalTransition", [
      transition(":enter", [
        style({ transform: "translateY(1rem)", opacity: 0 }),
        animate("300ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
      transition(":leave", [
        animate("150ms ease-in", style({ transform: "translateY(1rem)", opacity: 0 })),
      ]),
    ]),
  ],
})
export class JAlertDialogComponent {
  
  @Input() monocromatic: boolean = false;
  private readonly alertDialogService = inject(AlertDialogService);
  
  constructor(private readonly colorsService: JColorsService) { }

  // Single computed property for dialogs
  dialogs = computed(() => this.alertDialogService.dialogs());

  icons = {
    success: CircleCheck,
    error: CircleX,
    warning: TriangleAlert,
    info: Info,
    question: CircleHelp,
    loading: Loader2,
  };

  getIcon(type: string) {
    return this.icons[type as keyof typeof this.icons] || this.icons.info;
  }

  handleAction(action: "confirm" | "cancel" | "retry") {
    this.alertDialogService.executeAction(action);
  }


  // Get the class for the toast
  getDialogClass(type: string) {
    return this.colorsService.getAlertClass(type, this.monocromatic);
  }

  // Get the class for the icon
  getIconClass(type: string) {
    return this.colorsService.getIconClass(type, this.monocromatic);
  }

  // Get the class for the button
  getButtonClass(type: string): { [key: string]: boolean } {
    return this.colorsService.getButtonClass(type, this.monocromatic);
  }

  getButtonSecondaryClass(type: string): { [key: string]: boolean } {
    return this.colorsService.getButtonSecondaryClass(type, this.monocromatic);
  }
}