import { Routes } from "@angular/router";

// Guards
import { loggedInGuard } from "src/app/core/guards/logged-in.guard";
import { initGuard } from "src/app/core/guards/init.guard";
import { maintenanceGuard } from "src/app/core/guards/maintenance.guard";
import { roleGuard } from "src/app/core/guards/role.guard";

// Componentes
import { Modulo1Component } from "src/app/views/modulo1/modulo1.component";
import { HomeComponent } from "./home/home.component";
import { ConfigComponent } from "./config/config.component";
import { ProfileComponent } from "../profile/profile.component";
import { ExperimentalComponent } from "./config/experimental/experimental.component";
import { SystemComponent } from "./config/system/system.component";
import { UsersComponent } from "./config/users/users.component";

// Nombre de rutas
const home: string = 'inicio';            // 0
const profile: string = 'perfil';         // 1

const config: string = 'configuracion';   // 2
const systems: string = config + '/gestion-del-sistema';         // 3
const experimental: string = config + '/experimental';           // 4
const users: string = config + '/usuarios';                      // 5



// Convertir primera en mayuscula
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Definir el array de rutas en el constructor
export const routesArrayModulo1: string[] = [
    '/' + home,
    '/' + profile,
    '/' + config,
    '/' + systems,
    '/' + experimental,
    '/' + users,
];

export const routesModulo1: Routes = [
    {
        path: '', component: Modulo1Component,
        canActivate: [loggedInGuard, initGuard, maintenanceGuard],
        children: [
            {
                path: '', redirectTo: home, pathMatch: 'full'
            },
            // GENERAL
            {
                path: home, component: HomeComponent,
                canActivate: [roleGuard],
                data: {
                    title: capitalizeFirstLetter(home),
                    allowedRoles: [1, 2, 3, 4, 5, 6] // Asignar roles permitidos
                },
            },
            {
                path: profile, component: ProfileComponent,
                canActivate: [roleGuard],
                data: {
                    title: capitalizeFirstLetter(profile),
                    allowedRoles: [1, 2, 3, 4, 5, 6] // Asignar roles permitidos
                },
            },
            // CONFIGURACIONES
            {
                path: config, component: ConfigComponent,
                canActivate: [roleGuard],
                data: {
                    title: capitalizeFirstLetter(config),
                    allowedRoles: [1, 2, 3] // Asignar roles permitidos
                },
            },
            {
                path: experimental, component: ExperimentalComponent,
                canActivate: [roleGuard],
                data: {
                    title: capitalizeFirstLetter(experimental),
                    allowedRoles: [1] // Asignar roles permitidos
                },
            },
            {
                path: systems, component: SystemComponent,
                canActivate: [roleGuard],
                data: {
                    title: capitalizeFirstLetter(systems),
                    allowedRoles: [1] // Asignar roles permitidos
                },
            },
            {
                path: users, component: UsersComponent,
                canActivate: [roleGuard],
                data: {
                    title: capitalizeFirstLetter(users),
                    allowedRoles: [1, 2, 3] // Asignar roles permitidos
                },
            },
        ]
    }
]