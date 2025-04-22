import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<ThemeMode>('light');
  readonly themeSignal = this._theme.asReadonly();

  constructor() {
    this.initializeTheme();
    this.listenToExternalChanges(); // 👈 importante
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;

    if (savedTheme) {
      this._theme.set(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this._theme.set('dark');
    }

    this.applyTheme();
  }

  private listenToExternalChanges(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'theme' && event.newValue) {
        const newTheme = event.newValue as ThemeMode;
        this._theme.set(newTheme);
        this.applyTheme();
      }
    });
  }

  private applyTheme(): void {
    const current = this._theme();
    document.documentElement.classList.toggle('dark', current === 'dark');
  }

  toggleTheme(): void {
    const newTheme = this._theme() === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    this._theme.set(newTheme);
    this.applyTheme();
  }

  setTheme(theme: ThemeMode): void {
    localStorage.setItem('theme', theme);
    this._theme.set(theme);
    this.applyTheme();
  }

  getThemeMode(): ThemeMode {
    return this._theme();
  }
}
