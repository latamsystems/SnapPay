import { Component } from '@angular/core';
import { ButtonComponent } from 'src/app/lib/button/button.component';
import { Cpu, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-button-example',
  imports: [LucideAngularModule, ButtonComponent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ButtonExampleComponent {
  icon = Cpu;
}
