import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import 'highlight.js/styles/github-dark.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import html from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import { JButtonComponent } from 'src/app/lib/button/button.component';
import { Check, Copy } from 'lucide-angular';

hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('html', html);
hljs.registerLanguage('json', json);

@Component({
    selector: 'JCodeBlock',
    imports: [CommonModule, JButtonComponent],
    templateUrl: './code-block.component.html',
    styleUrls: ['./code-block.component.scss'],
})
export class JCodeBlockComponent implements AfterViewInit {

    icons: { [key: string]: any } = {
        copy: Copy,
        check: Check
    }

    copied = false;

    @Input() code: string = '';
    @Input() language: string = 'ts';

    @ViewChild('codeRef') codeRef!: ElementRef<HTMLElement>;
    highlightedCode: string = '';

    ngAfterViewInit() {
        this.codeRef.nativeElement.textContent = this.code;
        hljs.highlightElement(this.codeRef.nativeElement);
    }

    copyCode() {
        navigator.clipboard.writeText(this.code).then(() => {
            console.log('Copiado al portapapeles');
        });
        this.copied = true;
        setTimeout(() => (this.copied = false), 2000);
    }

}

