import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { routesArrayModulo1 } from 'src/app/views/modulo1/modulo1.routes';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment.development';
import { routesArray } from 'src/app/app.routes';
import { AlertDialogService } from 'src/app/lib/alert-dialog/elements/alert-dialog.service';
import { ModeToggleComponent } from 'src/app/components/mode-toggle/mode-toggle.component';
import { InputComponent } from 'src/app/lib/input/input.component';
import { LabelComponent } from 'src/app/lib/label/label.component';
import { ContentFormComponent } from 'src/app/lib/crud/form-component/components/content-form/content-form.component';
import { ErrorMessageComponent } from 'src/app/lib/crud/form-component/components/error-message/error-message.component';
import { ButtonComponent } from 'src/app/lib/button/button.component';
import { CheckboxComponent } from 'src/app/lib/checkbox/checkbox.component';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [ModeToggleComponent, RouterLink, FormsModule, ReactiveFormsModule, InputComponent, LabelComponent, ContentFormComponent, ErrorMessageComponent, ButtonComponent, CheckboxComponent]
})
export class AuthComponent {

  title: string = 'Iniciar Sesión';
  loading: boolean = false; // Para deshabilitar el botón de "Ingresar" durante la solicitud HTTP

  // Rutas
  routes: any[] = routesArray

  // Formulario
  loginForm!: FormGroup;

  // Variables de control de formulario perfil
  formControls: { [key: string]: AbstractControl | null } = {};
  messages: { title: string, description: string } | null = null;
  isVisiblePassword: boolean = false; // Para mostrar/ocultar la contraseña

  constructor(
    private readonly alertDialogService: AlertDialogService,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.initForm();
  }

  // Validaciones
  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email_user: ['', [Validators.required, Validators.pattern(/^[\w-ñÑ]+(?:\.[\w-ñÑ]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/)]],
      password_user: ['', [Validators.required]]
    });

    this.initializeFormControls();
  }

  // Controles de formulario
  initializeFormControls() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.formControls[`${key}_control`] = this.loginForm.get(key);
    });
  }

  login() {
    // Mensaje cuando hay campos vacios
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return
    }

    this.loading = true; // Activar carga

    const formData = {
      ...this.loginForm.value
    };

    this.authService.autenticate(formData).subscribe({
      next: (response) => {
        if (response.data.response !== 405) {

          // Verificar si la respuesta es exitosa y contiene un token
          if (response && response.ok && response.data && response.data.token) {

            // Almacenar el token en el almacenamiento local
            localStorage.setItem('token', response.data.token);

            // Asignar valor de inicio del estado del sidebar
            if (window.innerWidth < 800) {
              localStorage.setItem('sidebar', 'true');
            } else {
              // Si no existe, establecer 'sidebar' en 'true'
              if (!localStorage.getItem('sidebar')) {
                localStorage.setItem('sidebar', 'false');
              }
            }

            // Redireccionar
            if (environment.status) {
              // Produccion
              window.location.href = `/${environment.nameApp}/inicio`;  // Inicio

            } else {
              // Desarrollo
              window.location.href = routesArrayModulo1[0];  // Inicio
            }
          }

        } else {
          this.alertDialogService.AlertDialog({
            type: 'info',
            title: 'Credenciales incorrectas',
            description: 'Ingrese correctamente sus credenciales de acceso.',
            onConfirm: () => { console.log('ok') }
          })
        }
        // console.log(response)
      },
      error: (error) => {
        this.alertDialogService.AlertDialog({
          type: 'info',
          title: 'Credenciales incorrectas',
          description: 'Ingrese correctamente sus credenciales de acceso.',
          onConfirm: () => { console.log('ok') }
        })
        console.error('Error en la solicitud:', error);
      }
    }).add(() => {
      // Se ejecuta al finalizar la suscripción, independientemente de si hubo éxito o error
      this.loading = false; // Marcar como carga finalizada
    });
  }

  //===================================================================
  // Visualizar campos de contraseña
  //===================================================================

  togglePasswordVisibility(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.isVisiblePassword = true;
    } else {
      this.isVisiblePassword = false;
    }
  }
}
