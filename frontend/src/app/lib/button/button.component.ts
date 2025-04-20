import { NgClass } from "@angular/common"
import { Component, Input, Output, EventEmitter, inject } from "@angular/core"
import { LucideAngularModule, Loader2 } from "lucide-angular"
import { ColorsService } from "src/app/lib/colors/colors.service"
import { TooltipModule } from "primeng/tooltip"

@Component({
  selector: "JButton",
  standalone: true,
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
  imports: [NgClass, LucideAngularModule, TooltipModule],
})
export class ButtonComponent {
  icons = { loading: Loader2 }
  private readonly colorsService = inject(ColorsService)

  @Input() type: "button" | "submit" | "reset" = "button" // Tipo de botón
  @Input() disabled = false // Estado deshabilitado
  @Input() isLoading = false // Estado de carga
  @Input() icon!: any // Icono por defecto
  @Input() iconSize: number = 15 // Tamaño de icono por defecto
  @Input() text!: string | number // Color de icono por defecto
  @Input() isChangeIcon: boolean = false // Cambiar icono
  @Input() iconChange!: any // Icono de cambio
  @Input() tooltip: string = "" // Texto de tooltip
  @Input() tooltipPosition: "top" | "right" | "bottom" | "left" = "top" // Posición de tooltip

  @Output() clicked = new EventEmitter<Event>() // Evento de clic

  @Input() classes: string = "" // Clases adicionales
  @Input() ngClasses: { [key: string]: boolean } = {} // Clases dinámicas con [ngClass]

  // Verificar si una clase está presente en `classes` o `ngClasses`
  private hasClass(className: string): boolean {
    // Dividir la cadena de clases por espacios para verificar cada clase individualmente
    const classArray = this.classes.split(" ")
    return classArray.includes(className) || this.ngClasses[className]
  }

  // Definir clases según el tipo de botón (switch)
  get variantClasses(): string {
    return this.colorsService.variants[this.getActiveVariant()] || "min-w-[100px] text-black dark:text-white shadow-md"
  }

  // Obtener la variante activa
  private getActiveVariant(): string {
    // Buscar la primera variante que coincida con las clases proporcionadas
    const variant = Object.keys(this.colorsService.variants).find((variant) => this.hasClass(variant))
    return variant ?? "default"
  }

  // Combina las clases base con las variantes
  get computedClasses() {
    return {
      "flex gap-3 items-center justify-center font-semibold border border-border dark:border-dark-border px-3 py-2 rounded transition duration-300 select-none": true,
      [this.variantClasses]: true, // Aplica las clases de la variante según el switch
      "cursor-pointer": !this.disabled && !this.isLoading, // Cursor por defecto cuando está activo
      "cursor-default opacity-50 pointer-events-none": this.disabled || this.isLoading, // Cursor deshabilitado
      ...this.ngClasses, // Permite usar validaciones dinámicas con [ngClass]
    }
  }

  handleClick(event: Event) {
    if (!this.disabled && !this.isLoading) {
      this.clicked.emit(event)
    }
  }
}

