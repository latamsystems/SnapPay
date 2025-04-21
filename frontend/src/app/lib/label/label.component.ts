import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'JLabel',
  imports: [NgClass],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss'
})
export class JLabelComponent {

  @Input() for: string = '';
  @Input() text: string = '';
  @Input() isRequired: boolean = false;
  @Input() isConditioned: boolean = false;
  @Input() isAutomated: boolean = false;
  @Input() classes: string = '';
  @Input() ngClass: { [key: string]: boolean } = {};
}
