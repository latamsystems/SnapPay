import { Component, OnInit } from '@angular/core';
import { OptionComponent } from '../option/option.component';
import { JSelectComponent } from '../select.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericService } from '../../crud/elements/crud-generic.service';

@Component({
  selector: 'app-select-example',
  imports: [JSelectComponent, OptionComponent, FormsModule, CommonModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class SelectExampleComponent implements OnInit {

  banks = [
    { id_bank: 'banamex', name_bank: 'Banamex' },
    { id_bank: 'bancomer', name_bank: 'Bancomer' },
    { id_bank: 'santander', name_bank: 'Santander' },
    { id_bank: 'hsbc', name_bank: 'HSBC' },
    { id_bank: 'scotiabank', name_bank: 'Scotiabank' },
  ]

  items = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

  columns = [
    { key: 'id_bank', label: 'ID' },
    { key: 'name_bank', label: 'Nombre' },
  ];

  status!: any[];

  constructor(
    private readonly crudService: GenericService
  ) { }

  ngOnInit(): void {
    this.crudService.getAll<any>('status').subscribe({
      next: (response) => {
        this.status = response.data.status;
      }
    })
  }

  // =========================================
  // Ejemplo de uso de select simple
  // =========================================

  // Selector de opciones estaticas
  selectedOption: string | null = null;
  onOptionSelected(option: string) {
    console.log('Opción seleccionada:', option);
  }

  // Selector de objetos
  selectedBankId: string | null = null;
  onBankSelected(banknId: number) {
    console.log('Bank seleccionado:', banknId);
  }

  // Selector de arrays
  selectedItemId: string | null = null;
  onItemSelected(itemId: number) {
    console.log('Item seleccionado:', itemId);
  }

  // Selector de varios elementos
  selectedItems: string[] = [];
  onItemsSelected(items: string[]) {
    console.log('Items seleccionados:', items);
  }

  // Selector con apis inicializadas
  selectedStatusId: number | null = null;
  onStatusSelected(statusId: number) {
    console.log('Status seleccionado:', statusId);
  }

  // Selector de apis con recarga al abrir
  selectedUserId: number | null = null;
  onUserSelected(userId: number) {
    console.log('User seleccionado:', userId);
  }

  // Selector de apis con recarga inicial
  selectedRoleId: number | null = null;
  onRoleSelected(roleId: number) {
    console.log('Role seleccionado:', roleId);
  }
}
