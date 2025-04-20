import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mode-toggle',
  imports: [LucideAngularModule],
  templateUrl: './mode-toggle.component.html',
  styleUrl: './mode-toggle.component.scss'
})
export class ModeToggleComponent {
  icons = { Sun, Moon };

  title = 'frontend';
  theme: string = 'light';

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    this.loadTheme();
  }

  // Guardar el tema en localStorage solo en el navegador y actualizar la variable
  setTheme(theme: 'light' | 'dark') {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
    }
    this.theme = theme; // Actualizar la variable theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  // Cargar el tema solo si está en el navegador y asignarlo a la variable
  loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme');
      this.theme = storedTheme ? storedTheme : 'light'; // Asegurar que siempre haya un valor válido
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    }
  }

  // Alternar entre claro y oscuro, y actualizar la variable
  toggleDarkMode() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }


}
