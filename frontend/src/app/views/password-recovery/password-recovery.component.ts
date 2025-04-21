import { Subscription } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { routesArray } from 'src/app/app.routes';
import { MailService } from 'src/app/core/services/mail.service';
import { UserService } from 'src/app/core/services/content/user.service';
import { AlertDialogService } from 'src/app/lib/alert-dialog/elements/alert-dialog.service';
import { ModeToggleComponent } from 'src/app/components/mode-toggle/mode-toggle.component';
import { ArrowLeft, Loader2, LucideAngularModule } from 'lucide-angular';
import { JInputComponent } from 'src/app/lib/input/input.component';
import { ContentFormComponent } from 'src/app/lib/crud/form-component/components/content-form/content-form.component';
import { ErrorMessageComponent } from 'src/app/lib/crud/form-component/components/error-message/error-message.component';
import { JButtonComponent } from 'src/app/lib/button/button.component';
import { JCheckboxComponent } from 'src/app/lib/checkbox/checkbox.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-password-recovery',
  imports: [ModeToggleComponent, LucideAngularModule, RouterLink, FormsModule, ReactiveFormsModule, JInputComponent, ContentFormComponent, ErrorMessageComponent, JButtonComponent, JCheckboxComponent, NgClass],
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnDestroy {

  icons = {
    arrowLeft: ArrowLeft,
    loading: Loader2,
  }

  title1: string = 'RECUPERAR CUENTA';
  title2: string = 'INGRESAR CÓDIGO';
  title3: string = 'INGRESAR CONTRASEÑA';
  loading: boolean = false; // Para deshabilitar el botón de "Ingresar" durante la solicitud HTTP
  loadingVerify: boolean = false; // Para deshabilitar el botón de "Verificar" durante la solicitud HTTP
  loadingRecovery: boolean = false; // Para deshabilitar el botón de "Restablecer" durante la solicitud HTTP

  // Timer
  timer: string = '00:00'
  private timerSubscription: Subscription | null = null;
  isRecovery: boolean = false   // Icono de carga

  // Control de etapas de envio
  isCodeSent: boolean = false; // Cambio de formulario de email a codigo
  isPasswdSent: boolean = false; // Cambio de formulario de codigo a password

  // Rutas
  routes: string[] = routesArray;

  // Formulario
  recoveryForm!: FormGroup;
  email_user: string = 'example@example.com';
  verification_code: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Variables de control de formulario perfil
  formControls: { [key: string]: AbstractControl | null } = {};
  messages: { title: string, description: string } | null = null;
  isVisiblePassword: boolean = false; // Para mostrar/ocultar la contraseña

  constructor(
    private readonly router: Router,
    private readonly alertDialogService: AlertDialogService,
    private readonly formBuilder: FormBuilder,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {
    this.initForm();
  }

  // Validaciones
  initForm(): void {
    this.recoveryForm = this.formBuilder.group({
      email_user: ['', [Validators.required, Validators.pattern(/^[\w-ñÑ]+(?:\.[\w-ñÑ]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/)]],
      verification_code: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, this.securePasswordValidator]],
      confirmPassword: ['', [Validators.required, this.securePasswordValidator]],
    }, { validators: this.passwordMatchValidator });

    this.initializeFormControls();
  }

  // Controles de formulario
  initializeFormControls() {
    Object.keys(this.recoveryForm.controls).forEach(key => {
      this.formControls[`${key}_control`] = this.recoveryForm.get(key);
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  //===================================================================
  // Enviar recuperacion de contraseña
  //===================================================================

  recoveryPasswd() {
    if (!this.isCodeSent) {
      this.recoveryForm.get('verification_code')?.clearValidators();
      this.recoveryForm.get('newPassword')?.clearValidators();
      this.recoveryForm.get('confirmPassword')?.clearValidators();
    } else {
      this.recoveryForm.get('email_user')?.setValidators([Validators.required, Validators.pattern(/^[\w-ñÑ]+(?:\.[\w-ñÑ]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/)]);
    }

    this.formControls['verification_code_control']?.markAsTouched();
    this.formControls['verification_code_control']?.updateValueAndValidity();
    this.formControls['email_user_control']?.markAsTouched();
    this.formControls['email_user_control']?.updateValueAndValidity();

    this.formControls['newPassword_control']?.updateValueAndValidity();
    this.formControls['confirmPassword_control']?.updateValueAndValidity();

    // Mensaje cuando hay campos vacios
    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    this.loading = true; // Activar carga

    const formData = {
      ...this.recoveryForm.value
    };

    this.mailService.resetPasswordCode(formData).subscribe({
      next: (response) => {
        this.startTimer(response.data.time); // Iniciar el temporizador
        this.email_user = formData.email_user;
        this.isCodeSent = true; // Cambio de formulario

        if (this.isRecovery) {
          this.recoveryForm.get('verification_code')?.setValue(null);
        }
        this.isRecovery = false;  // Finalizar carga de refresh
        this.loading = false; // Marcar como carga finalizada
      },
      error: (error) => {
        this.alertDialogService.AlertDialog({
          type: 'error',
          title: 'Algo salió mal!',
          description: error.error.msg,
          onConfirm: () => { }
        })
        this.isRecovery = false;  // Finalizar carga de refresh
        this.loading = false; // Marcar como carga finalizada
      }
    }).add(() => {
      // Se ejecuta al finalizar la suscripción, independientemente de si hubo éxito o error
      this.isRecovery = false;  // Finalizar carga de refresh
      this.loading = false; // Marcar como carga finalizada
    });
  }

  //===================================================================
  // Verificar codigo de cambio
  //===================================================================

  verifyCode() {
    if (this.isCodeSent) {
      this.recoveryForm.get('verification_code')?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      this.recoveryForm.get('newPassword')?.clearValidators();
      this.recoveryForm.get('confirmPassword')?.clearValidators();
      this.recoveryForm.get('email_user')?.clearValidators();
    }

    this.formControls['verification_code_control']?.markAsTouched();
    this.formControls['verification_code_control']?.updateValueAndValidity();
    this.formControls['email_user_control']?.markAsTouched();
    this.formControls['email_user_control']?.updateValueAndValidity();

    this.formControls['newPassword_control']?.updateValueAndValidity();
    this.formControls['confirmPassword_control']?.updateValueAndValidity();

    // Mensaje cuando hay campos vacios
    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    this.loadingVerify = true; // Activar carga

    const formData = {
      ...this.recoveryForm.value,
      email_user: this.email_user,
    };

    this.userService.resetPasswordUserTokenVerify(formData).subscribe({
      next: (response) => {

        this.verification_code = formData.verification_code;
        this.isPasswdSent = true; // Cambio de formulario

        // Activar validaciones de campos para el siguiente paso
        if (this.isPasswdSent) {
          this.recoveryForm.get('newPassword')?.setValidators([Validators.required, this.securePasswordValidator]);
          this.recoveryForm.get('confirmPassword')?.setValidators([Validators.required, this.securePasswordValidator]);
        } else {
          this.recoveryForm.get('email_user')?.clearValidators();
          this.recoveryForm.get('verification_code')?.clearValidators();
        }

        this.formControls['newPassword_control']?.updateValueAndValidity();
        this.formControls['confirmPassword_control']?.updateValueAndValidity();
        this.formControls['email_user_control']?.updateValueAndValidity();
        this.formControls['verification_code_control']?.updateValueAndValidity();

        // Detener el temporizador
        this.clearTimer();
      },
      error: (error) => {
        this.alertDialogService.AlertDialog({
          type: 'error',
          title: 'Algo salió mal!',
          description: error.error.msg,
          onConfirm: () => { }
        })
      }
    }).add(() => {
      // Se ejecuta al finalizar la suscripción, independientemente de si hubo éxito o error
      this.loadingVerify = false; // Marcar como carga finalizada
    });
  }

  //===================================================================
  // Restablecer contraseña
  //===================================================================
  recoveryPassword() {
    if (this.isPasswdSent) {
      this.recoveryForm.get('newPassword')?.setValidators([Validators.required, this.securePasswordValidator]);
      this.recoveryForm.get('confirmPassword')?.setValidators([Validators.required, this.securePasswordValidator]);
    } else {
      this.recoveryForm.get('email_user')?.clearValidators();
      this.recoveryForm.get('verification_code')?.clearValidators();
    }

    this.formControls['newPassword_control']?.markAsTouched();
    this.formControls['newPassword_control']?.updateValueAndValidity();
    this.formControls['confirmPassword_control']?.markAsTouched();
    this.formControls['confirmPassword_control']?.updateValueAndValidity();

    this.formControls['email_user_control']?.markAsTouched();
    this.formControls['email_user_control']?.updateValueAndValidity();
    this.formControls['verification_code_control']?.markAsTouched();
    this.formControls['verification_code_control']?.updateValueAndValidity();

    // Mensaje cuando hay campos vacios
    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    this.loadingRecovery = true; // Activar carga

    const formData = {
      ...this.recoveryForm.value,
      email_user: this.email_user,
      verification_code: this.verification_code,
    };

    console.log(formData);

    this.userService.resetPasswordUserToken(formData).subscribe({
      next: (response) => {
        this.alertDialogService.AlertDialog({
          type: 'success',
          title: 'Contraseña actualizada',
          description: 'Se actualizó su contraseña correctamente.',
          onConfirm: async () => {
            this.backActions();
            this.router.navigate([routesArray[1]]); // Login
          }
        })
      },
      error: (error) => {
        this.alertDialogService.AlertDialog({
          type: 'error',
          title: 'Algo salió mal!',
          description: error.error.msg,
          onConfirm: () => { }
        })

        this.loadingRecovery = false; // Marcar como carga finalizada
      }
    }).add(() => {
      // Se ejecuta al finalizar la suscripción, independientemente de si hubo éxito o error
      this.loadingRecovery = false; // Marcar como carga finalizada
    });
  }

  //===================================================================
  // Regresar acciones
  //===================================================================

  backActions() {
    // Cuando es la vista de verificacion
    if (this.isCodeSent) {

      // Restablecer valores
      this.isCodeSent = false;
      this.isPasswdSent = false;
      this.email_user = 'example@example.com';
      this.verification_code = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.recoveryForm.reset();

      // Restablecer validaciones
      this.recoveryForm.get('email_user')?.setValidators([Validators.required, Validators.pattern(/^[\w-ñÑ]+(?:\.[\w-ñÑ]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/)]);
      this.formControls['email_user_control']?.updateValueAndValidity();
      this.recoveryForm.get('verification_code')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.formControls['verification_code_control']?.updateValueAndValidity();
      this.recoveryForm.get('newPassword')?.setValidators([Validators.required, this.securePasswordValidator]);
      this.formControls['newPassword_control']?.updateValueAndValidity();
      this.recoveryForm.get('confirmPassword')?.setValidators([Validators.required, this.securePasswordValidator]);
      this.formControls['confirmPassword_control']?.updateValueAndValidity();

      // Detener el temporizador
      this.clearTimer();
    }

    this.loading = false; // Desactivar carga
    this.loadingVerify = false; // Desactivar carga
    this.loadingRecovery = false; // Desactivar carga
  }

  //===================================================================
  // Validacion de contraseña robusta
  //===================================================================

  // Validador personalizado para contraseñas seguras
  securePasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';

    // Expresión regular para una contraseña segura
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialCharacter && isValidLength;

    if (!passwordValid) {
      return {
        securePassword: 'Agregar al menos 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales.'
      };
    }

    return null;
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
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

  //===================================================================
  // Temporizador del token
  //===================================================================

  startTimer(expirationTime: string) {
    const expirationDate = new Date(expirationTime).getTime();
    const now = new Date().getTime();
    let timer = Math.floor((expirationDate - now) / 1000); // Convert to seconds

    let minutes, seconds;
    this.clearTimer(); // Clear any existing timer

    this.timerSubscription = new Subscription();
    const intervalId = setInterval(() => {
      minutes = Math.floor(timer / 60);
      seconds = timer % 60;

      this.timer = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      if (--timer < 0) {
        this.clearTimer();
        this.timer = '00:00';
        this.backActions(); // Llamar a la función backActions cuando el temporizador llegue a cero
      }
    }, 1000);

    this.timerSubscription.add({
      unsubscribe() {
        clearInterval(intervalId);
      }
    });
  }

  clearTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
}
