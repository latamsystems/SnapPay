import { Routes } from '@angular/router';

// Guards
import { loggedOutGuard } from 'src/app/core/guards/logged-out.guard';
import { maintenanceGuard } from 'src/app/core/guards/maintenance.guard';
import { serverStatusGuard } from 'src/app/core/guards/server-status.guard';
import { blockMaintenanceGuard } from 'src/app/core/guards/block-maintenance.guard';

// Componentes
import { Error404Component } from 'src/app/views/error/404/404.component';
import { AuthComponent } from 'src/app/views/auth/auth.component';
import { MaintenanceComponent } from 'src/app/views/maintenance/maintenance.component';
import { AdminComponent } from 'src/app/views/admin/admin.component';
import { Error500Component } from 'src/app/views/error/500/500.component';
import { PasswordRecoveryComponent } from 'src/app/views/password-recovery/password-recovery.component';

// Nombre de rutas
const error404: string = '404';                             // 0
const login: string = 'login';                              // 1
const maintenance: string = 'mantenimiento';                // 2
const error500: string = '500';                             // 3
const admin: string = 'admin';                              // 4
const recoveryPassword: string = 'recuperar-clave';         // 5

// Convertir primera en mayuscula
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Definir el array de rutas en el constructor
export const routesArray: string[] = [
    '/' + error404,
    '/' + login,
    '/' + maintenance,
    '/' + error500,
    '/' + admin,
    '/' + recoveryPassword,
];

export const routes: Routes = [
    { path: login, redirectTo: login, pathMatch: 'full' },
    {
        path: login, component: AuthComponent,
        data: { title: capitalizeFirstLetter(login) },
        canActivate: [loggedOutGuard, maintenanceGuard, serverStatusGuard]
    },
    {
        path: error404, component: Error404Component,
        data: { title: capitalizeFirstLetter(error404) }
    },
    {
        path: maintenance, component: MaintenanceComponent,
        data: { title: capitalizeFirstLetter(maintenance) },
        canActivate: [blockMaintenanceGuard]
    },
    {
        path: error500, component: Error500Component,
        data: { title: capitalizeFirstLetter(error500) },
        canActivate: [maintenanceGuard]
    },
    {
        path: admin, component: AdminComponent,
        data: { title: capitalizeFirstLetter(admin) },
        canActivate: [loggedOutGuard, maintenanceGuard]
    },
    {
        path: recoveryPassword, component: PasswordRecoveryComponent,
        data: { title: capitalizeFirstLetter(recoveryPassword) },
        canActivate: [loggedOutGuard, maintenanceGuard]
    },
    // Redirige todas las demás rutas a la ruta de error
    { path: '**', redirectTo: routesArray[0] }
];
