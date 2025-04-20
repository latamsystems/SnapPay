import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'JOption',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: []
})
export class OptionComponent implements AfterViewInit {
  @Input() value: any;
  @Input() disabled = false;

  // Used internally by JSelect
  @HostBinding('attr.data-value')
  get dataValue() {
    return this.value;
  }

  // Store the text content for display in the select
  private _text = '';
  
  public get text(): string {
    return this._text;
  }

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // Extract text content after view is initialized
    this._text = this.elementRef.nativeElement.textContent.trim();
  }

  // This will be called by JSelect to set the text content
  setTextContent(text: string) {
    this._text = text;
  }
}