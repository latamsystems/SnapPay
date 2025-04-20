import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Check, Loader2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'JCheckbox',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {

  // Lucide icons
  icons = {
    check: Check,
    loading: Loader2,
  };

  @Input() type: 'checkbox' | 'switch' = 'checkbox'; // Default type;
  @Input() icon: any = this.icons.check; // Default icon
  @Input() iconSize: number = 15; // Default icon size
  @Input() disabled?: boolean; // Desactivar el checkbox
  @Input() isLoading?: boolean; // Indicar que el checkbox esta cargando
  @Input() classes: string = ''; // Clases adicionales para el checkbox

  @Input() title!: string; // Estado del checkbox
  @Input() isChecked: boolean = false; // Estado del checkbox
  
  @Input() item: any; // Item 
  @Input() column: any; // Columna
  
  // Funciones
  @Input() getValue: (item: any, column: any) => boolean = () => false;
  @Input() onCheckboxChange: (item: any, column: any) => void = () => { };

  @Input() toggleSwitch: (isChecked: boolean) => void = () => { };
}