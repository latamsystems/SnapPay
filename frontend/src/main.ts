import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from 'src/app/app.config';
import { AppComponent } from 'src/app/app.component';

// Importa la configuración regional de Colombia
import localeEs from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';

// Registra la zona horaria de Bogotá
registerLocaleData(localeEs);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
