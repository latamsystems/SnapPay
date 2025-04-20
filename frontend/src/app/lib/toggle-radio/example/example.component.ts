import { Component } from '@angular/core';
import { ToggleRadioComponent } from '../toggle-radio.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle-radio-example',
  imports: [ToggleRadioComponent, CommonModule, FormsModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ToggleRadioExampleComponent {
  selectedRoleId: number | null = null;
  selectedRoleApi: number | null = null;

  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Usuario' }
  ];

  onSelected(value: any) {
    console.log('Cambió a:', value);
  }
}
