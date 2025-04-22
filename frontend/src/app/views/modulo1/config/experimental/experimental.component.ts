import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JButtonComponent } from 'src/app/lib/button/button.component';
import { JThemeComponent } from 'src/app/lib/colors/theme/theme.component';
import { JInputComponent } from 'src/app/lib/input/input.component';

@Component({
  selector: 'app-experimental',
  templateUrl: './experimental.component.html',
  styleUrls: ['./experimental.component.scss'],
  imports: [JInputComponent, JButtonComponent, FormsModule, JThemeComponent],
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

  // =============================================================

  downloadAsIco(): void {
    if (!this.file) return;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, size, size);

        canvas.toBlob((blob) => {
          if (blob) {
            this.downloadBlob(blob, `${this.file?.name.split('.')[0]}.ico`);
          } else {
            console.error('No se pudo generar el blob');
          }
        }, 'image/x-icon');
      };
      img.src = reader.result as string;
    };
  }

  // =============================================================

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
