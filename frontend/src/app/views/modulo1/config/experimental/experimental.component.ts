import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/lib/button/button.component';
import { InputComponent } from 'src/app/lib/input/input.component';

@Component({
  selector: 'app-experimental',
  templateUrl: './experimental.component.html',
  styleUrls: ['./experimental.component.scss'],
  imports: [InputComponent ,ButtonComponent, FormsModule],
})
export class ExperimentalComponent {
  file: File | null = null;

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }

  downloadAsBin(): void {
    if (this.file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.file);
      reader.onload = () => {
        // Comprobar que result no sea null antes de proceder
        if (reader.result) {
          const blob = new Blob([reader.result], { type: 'application/octet-stream' });
          this.downloadBlob(blob, `${this.file?.name}.bin`);
        } else {
          console.error('No se pudo leer el archivo o el archivo está vacío');
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    }
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
