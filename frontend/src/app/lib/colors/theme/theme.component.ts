import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JButtonComponent } from 'src/app/lib/button/button.component';
import { JInputComponent } from 'src/app/lib/input/input.component';
import { ThemeService, ThemeMode } from './elements/theme.service';
import { JLabelComponent } from "../../label/label.component";
import { JContentFormComponent } from '../../crud/form-component/components/content-form/content-form.component';
import { Check, Copy, LucideAngularModule, Moon, Sun } from 'lucide-angular';

interface ColorPosition {
    x: number;
    y: number;
}

interface GeneratedColors {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;

    darkBackground: string;
    darkForeground: string;
    darkCard: string;
    darkCardForeground: string;
    darkPopover: string;
    darkPopoverForeground: string;
    darkPrimary: string;
    darkPrimaryForeground: string;
    darkSecondary: string;
    darkSecondaryForeground: string;
    darkMuted: string;
    darkMutedForeground: string;
    darkAccent: string;
    darkAccentForeground: string;
    darkDestructive: string;
    darkDestructiveForeground: string;
    darkBorder: string;
    darkInput: string;
    darkRing: string;
}

@Component({
    selector: 'JTheme',
    templateUrl: './theme.component.html',
    styleUrls: ['./theme.component.scss'],
    standalone: true,
    imports: [LucideAngularModule, JInputComponent, JButtonComponent, FormsModule, JLabelComponent, JContentFormComponent]
})
export class JThemeComponent {

    private readonly themeService = inject(ThemeService);

    icons = {
        copy: Copy,
        check: Check,
        sun: Sun,
        moon: Moon,
    };

    // Color picker state
    baseColor: string = '#415884';
    saturation: number = 34.01;
    lightness: number = 38.63;
    huePosition: number = 219;
    colorPickerPosition: ColorPosition = { x: 50, y: 50 };

    // Sync preview with signal
    previewMode: ThemeMode = localStorage.getItem('theme') as ThemeMode || 'light';
    private lastTheme: ThemeMode = this.previewMode;

    isPickingColor = false;
    copied = false;

    themeCode: string = '';
    generatedColors!: GeneratedColors;

    ngOnInit() {
        this.syncFromHSL();

        // Sincronizacion del tema con el localStorage
        setInterval(() => {
            const current = localStorage.getItem('theme') as ThemeMode;
            if (current && current !== this.lastTheme) {
                this.previewMode = current;
                this.lastTheme = current;
                this.generateTheme();
            }
        }, 300); // verifica cada 300ms
    }

    // Color picker gradient
    get hueGradient(): string {
        return `linear-gradient(to right, 
      hsl(0, 100%, 50%),
      hsl(60, 100%, 50%),
      hsl(120, 100%, 50%),
      hsl(180, 100%, 50%),
      hsl(240, 100%, 50%),
      hsl(300, 100%, 50%),
      hsl(360, 100%, 50%))`;
    }

    getCurrentTheme(): string {
        return this.themeService.getThemeMode();
    }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }

    setPreviewMode(mode: ThemeMode): void {
        this.previewMode = mode;
    }

    startColorPicking(event: MouseEvent): void {
        this.isPickingColor = true;
        this.updateColorFromPosition(event);
    }

    updateColorPicking(event: MouseEvent): void {
        if (this.isPickingColor) {
            this.updateColorFromPosition(event);
        }
    }

    stopColorPicking(): void {
        this.isPickingColor = false;
    }

    updateColorFromPosition(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        this.colorPickerPosition = { x: x * 100, y: y * 100 };
        this.saturation = x * 100;
        this.lightness = (1 - y) * 100;
        this.syncFromHSL();
    }

    updateHueFromInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.huePosition = parseInt(input.value);
        this.syncFromHSL();
    }

    updateFromHexInput(): void {
        if (!this.baseColor.startsWith('#')) this.baseColor = '#' + this.baseColor;
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexRegex.test(this.baseColor)) return;
        const { h, s, l } = this.hexToHSL(this.baseColor);
        this.huePosition = h;
        this.saturation = s;
        this.lightness = l;
        this.colorPickerPosition = { x: s, y: 100 - l };
        this.syncFromHSL();
    }

    syncFromHSL(): void {
        this.baseColor = this.hslToHex(this.huePosition, this.saturation, this.lightness);
        this.generateTheme();
    }

    hexToHSL(hex: string): { h: number; s: number; l: number } {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }

        return { h, s: s * 100, l: l * 100 };
    }

    hslToHex(h: number, s: number, l: number): string {
        h %= 360;
        s /= 100;
        l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (h < 60) [r, g, b] = [c, x, 0];
        else if (h < 120) [r, g, b] = [x, c, 0];
        else if (h < 180) [r, g, b] = [0, c, x];
        else if (h < 240) [r, g, b] = [0, x, c];
        else if (h < 300) [r, g, b] = [x, 0, c];
        else[r, g, b] = [c, 0, x];

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
    }


    generateTheme(): void {
        this.baseColor = this.hslToHex(this.huePosition, this.saturation * 0.9, this.lightness);

        const vars = this.generatedColors = {
            background: this.hslToHex(this.huePosition, this.saturation, 95),
            foreground: this.hslToHex(210, 6, 10),
            card: this.hslToHex(this.huePosition, this.saturation * 0.3, 90),
            cardForeground: this.hslToHex(this.huePosition, this.saturation * 0.8, 15),
            popover: this.hslToHex(this.huePosition, this.saturation * 0.2, 95),
            popoverForeground: this.hslToHex(this.huePosition, this.saturation, 7),
            primary: this.baseColor,
            primaryForeground: '#FFFFFF',
            secondary: this.hslToHex(this.huePosition, this.saturation * 0.4, 75),
            secondaryForeground: '#000000',
            muted: this.hslToHex(this.huePosition, this.saturation * 0.1, 85),
            mutedForeground: this.hslToHex(this.huePosition, this.saturation * 0.5, 40),
            accent: this.hslToHex(this.huePosition, this.saturation * 0.1, 82),
            accentForeground: this.hslToHex(this.huePosition, this.saturation * 0.8, 15),
            destructive: '#BF3F3F',
            destructiveForeground: this.hslToHex(this.huePosition, this.saturation * 0.2, 95),
            border: this.hslToHex(this.huePosition, this.saturation * 0.5, 60),
            input: this.hslToHex(this.huePosition, this.saturation * 0.5, 60),
            ring: this.baseColor,

            darkBackground: this.mixHsl(
                this.huePosition, this.saturation * 0.7, 8, // base
                210, 6, 10,                                // toque azulado oscuro
                0.6                                       // intensidad del mix (15%)
            ),
            darkForeground: this.hslToHex(this.huePosition, this.saturation * 0.2, 90),
            darkCard: this.hslToHex(this.huePosition, this.saturation * 0.8, 8),
            darkCardForeground: this.hslToHex(this.huePosition, this.saturation * 0.2, 90),
            darkPopover: this.hslToHex(this.huePosition, this.saturation * 0.8, 3),
            darkPopoverForeground: this.hslToHex(this.huePosition, this.saturation * 0.2, 90),
            darkPrimary: this.hslToHex(this.huePosition, this.saturation * 0.7, 28),
            darkPrimaryForeground: '#FFFFFF',
            darkSecondary: this.hslToHex(this.huePosition, this.saturation * 0.6, 20),
            darkSecondaryForeground: '#FFFFFF',
            darkMuted: this.hslToHex(this.huePosition, this.saturation * 0.3, 25),
            darkMutedForeground: this.hslToHex(this.huePosition, this.saturation * 0.2, 60),
            darkAccent: this.hslToHex(this.huePosition, this.saturation * 0.3, 25),
            darkAccentForeground: this.hslToHex(this.huePosition, this.saturation * 0.2, 90),
            darkDestructive: '#BF3F3F',
            darkDestructiveForeground: this.hslToHex(this.huePosition, this.saturation * 0.2, 90),
            darkBorder: this.hslToHex(this.huePosition, this.saturation * 0.5, 45),
            darkInput: this.hslToHex(this.huePosition, this.saturation * 0.5, 45),
            darkRing: this.hslToHex(this.huePosition, this.saturation * 0.7, 28),
        };

        const toCssVar = (key: string, value: string) =>
            `  --color-${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${value};`;

        const keys = Object.keys(vars) as (keyof GeneratedColors)[];
        const lines: string[] = [];

        let darkStarted = false;
        for (const key of keys) {
            if (!darkStarted && key.startsWith('dark')) {
                lines.push(''); // Insertamos línea vacía justo antes del primer dark
                darkStarted = true;
            }
            lines.push(toCssVar(key, vars[key]));
        }

        lines.push(`  --color-radius: 0.5rem;`);
        lines.push(`  --color-dark-radius: 0.5rem;`);

        this.themeCode = `@theme {\n${lines.join('\n')}\n}`;
    }


    copyThemeToClipboard(): void {
        navigator.clipboard.writeText(this.themeCode);
        this.copied = true;
        setTimeout(() => (this.copied = false), 2000);
    }

    mixHsl(h1: number, s1: number, l1: number, h2: number, s2: number, l2: number, ratio: number): string {
        const h = h1 * (1 - ratio) + h2 * ratio;
        const s = s1 * (1 - ratio) + s2 * ratio;
        const l = l1 * (1 - ratio) + l2 * ratio;
        return this.hslToHex(h, s, l);
    }

}
