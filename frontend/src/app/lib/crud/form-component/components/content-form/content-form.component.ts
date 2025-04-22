import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'JContentForm',
  imports: [NgClass],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss'
})
export class JContentFormComponent {
  @Input() columns: number = 1;
  @Input() rows: boolean = false;

  getClasses(): string {
    if (this.rows) return 'flex flex-row gap-3 items-center';
  
    const base = 'grid gap-2';
    const columnClassMap: { [key: number]: string } = {
      1: 'flex flex-col gap-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-6',
    };
  
    return `${base} ${columnClassMap[this.columns] || columnClassMap[1]}`;
  }
  
  
}
