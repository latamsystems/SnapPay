import { Component } from '@angular/core';
import { JButtonComponent } from 'src/app/lib/button/button.component';
import { Cpu, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-button-example',
  imports: [LucideAngularModule, JButtonComponent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ButtonExampleComponent {
  icon = Cpu;
}
