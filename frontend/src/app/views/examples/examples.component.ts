import { Component } from '@angular/core';
import { AlertDialogExampleComponent } from 'src/app/lib/alert-dialog/example/example.component';
import { ButtonExampleComponent } from 'src/app/lib/button/example/example.component';
import { AlertToastExampleComponent } from 'src/app/lib/alert-toast/example/example.component';
import { SelectExampleComponent } from 'src/app/lib/select/example/example.component';
import { TableExampleComponent } from 'src/app/lib/crud/table-component/example/example.component';
import { ToggleRadioExampleComponent } from 'src/app/lib/toggle-radio/example/example.component';

@Component({
  selector: 'app-examples',
  imports: [AlertDialogExampleComponent, AlertToastExampleComponent, ButtonExampleComponent, SelectExampleComponent, TableExampleComponent, ToggleRadioExampleComponent],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.scss'
})
export class ExamplesComponent {

}
