import { LOCALE_ID, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Icons
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';

// PrimeNG
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeng/themes/aura';

// Rutas
import { routes } from 'src/app/app.routes';

// Interceptores
import { serverStatusInterceptor } from 'src/app/core/interceptors/server-status.interceptor';
import { authTokenInterceptor } from 'src/app/core/interceptors/auth-token.interceptor';
import { errorInterceptor } from 'src/app/core/interceptors/error.interceptor';
import { routesModulo1 } from 'src/app/views/modulo1/modulo1.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'es-CO' },

    provideRouter(routesModulo1),
    provideRouter(routes),
    
    provideHttpClient(withInterceptors([serverStatusInterceptor, authTokenInterceptor, errorInterceptor])),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    CurrencyPipe,

    provideIcons({ lucideCross }),
    
    providePrimeNG({ theme: { preset: Aura } }),
    MessageService,
  ]
};
