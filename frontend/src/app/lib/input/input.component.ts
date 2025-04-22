import { Component, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'JInput',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, LucideAngularModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JInputComponent),
      multi: true
    }
  ]
})
export class JInputComponent implements ControlValueAccessor {

  icons = {
    x: X,
  }

  @Input() type: 'text' | 'password' | 'number' | 'date' | 'datetime-local' | 'email' | 'file' | 'textarea' | 'range' = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() name?: string;
  @Input() id?: string;
  @Input() classes: string = '';
  @Input() ngClass: { [key: string]: boolean } = {};
  @Input() accept: string = '';
  @Input() multiple: boolean = false;
  @Input() showImage: boolean = false;
  @Input() clearButton: boolean = false;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() isLabel: boolean = false;
  @Input() simbol: string = '';


  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  innerValue: any = '';
  previewUrl: string | null = null;

  get value(): any {
    return this.innerValue;
  }

  get combinedNgClass() {
    return {
      ...(this.ngClass || {}),
      'opacity-50': this.disabled
    };
  }
  
  set value(val: any) {
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.onChange(val);
    }
  }

  // ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(val: any): void {
    if (this.type !== 'file') {
      this.innerValue = val ?? '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
     // Si es tipo archivo, limpia
    if (isDisabled && this.type === 'file') {
      this.innerValue = null;
      this.previewUrl = null;
    }
  }
  

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
    this.onTouched();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files) {
      const value = this.multiple ? Array.from(files) : files[0];
      this.innerValue = value;
      this.onChange(value);
      this.onTouched();

      if (!this.multiple && value instanceof File && value.type?.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(value);
      } else {
        this.previewUrl = null;
      }
    }
  }

  clearInput(): void {
    this.value = '';
    this.onChange('');
    this.onTouched();
  }

  clearFile(): void {
    this.innerValue = null;
    this.previewUrl = null;
    this.onChange(this.multiple ? [] : null);
    this.onTouched();

    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

}
