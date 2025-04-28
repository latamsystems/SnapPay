 
// ===============================================
// Librería de Componentes y Funciones - tailjNg
// ===============================================
// Descripción:
//   Esta librería está diseñada para ofrecer un conjunto de componentes reutilizables y funciones
//   optimizadas para facilitar el desarrollo de interfaces de usuario y la gestión de datos en aplicaciones 
//   web. Incluye herramientas para mejorar la experiencia del desarrollador y la interacción con el usuario.
// Propósito:
//   - Crear componentes modulares y personalizables.
//   - Mejorar la eficiencia del desarrollo front-end mediante herramientas reutilizables.
//   - Proporcionar soluciones escalables y fáciles de integrar con aplicaciones existentes.
// Uso:
//   Para obtener la funcionalidad completa, simplemente importa los módulos necesarios y usa los 
//   componentes según tu caso de uso. Asegúrate de revisar la documentación oficial para obtener ejemplos 
//   detallados sobre su implementación y personalización.
// Autores:
//   Armando Josue Velasquez Delgado - Desarrollador principal
// Licencia:
//   Este proyecto está licenciado bajo la MIT - ver el archivo LICENSE para más detalles.
// Versión: 0.0.9
// Fecha de creación: 2025-01-04
// =============================================== 


import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<ThemeMode>('light');
  readonly themeSignal = this._theme.asReadonly();

  constructor() {
    this.initializeTheme();
    this.listenToExternalChanges(); // importante
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
