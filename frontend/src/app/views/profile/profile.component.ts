import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/content/user.service';
import { SidebarService } from 'src/app/core/services/static/layout/sidebar.service';
import { SessionShared } from 'src/app/core/shared/session.shared';
import { SidebarShared } from 'src/app/core/shared/sidebar.shared';
import { PasswdChangeResults, UserResult } from 'src/app/core/interfaces/entities/user.interface';
import { CalendarService } from 'src/app/core/services/static/transformer/calendar.service';
import { Gem, Info, KeyRound, LucideAngularModule, UserRoundCheck } from 'lucide-angular';
import { InputComponent } from 'src/app/lib/input/input.component';
import { SelectComponent } from 'src/app/lib/select/select.component';
import { LabelComponent } from 'src/app/lib/label/label.component';
import { ContentFormComponent } from 'src/app/lib/crud/form-component/components/content-form/content-form.component';
import { ErrorMessageComponent } from 'src/app/lib/crud/form-component/components/error-message/error-message.component';
import { ConverterService } from 'src/app/lib/crud/elements/converter.service';
import { ButtonComponent } from 'src/app/lib/button/button.component';
import { AlertDialogService } from 'src/app/lib/alert-dialog/elements/alert-dialog.service';
import { AlertToastService } from 'src/app/lib/alert-toast/elements/alert-toast.service';
import { CheckboxComponent } from 'src/app/lib/checkbox/checkbox.component';
import { GenericService } from 'src/app/lib/crud/elements/crud-generic.service';
import { FormShared } from 'src/app/core/shared/form.shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [],
  standalone: true,
  imports: [LucideAngularModule, NgClass, FormsModule, ReactiveFormsModule, DropdownModule, TooltipModule, CalendarModule, InputComponent, ButtonComponent, CheckboxComponent, SelectComponent, LabelComponent, ContentFormComponent, ErrorMessageComponent],
})
export class ProfileComponent implements OnInit, OnDestroy {

  session!: SessionShared;
  sidebar!: SidebarShared;

  icons = {
    userCheck: UserRoundCheck,
    info: Info,
    keyRound: KeyRound,
    gem: Gem,
  }

  // Selects
  banks!: any[];

  // Variables del usuario a utilizar
  firstname_user: string = 'Nombre';
  lastname_user: string = 'Apellido';
  identification_user: string = 'xxxxxxxxxx';

  name_role: string = 'ROL';


  // Variables de control de formulario perfil
  frormProfile!: FormGroup

  // Variables de control de formulario perfil
  formControlsProfile: { [key: string]: AbstractControl | null } = {};
  isVisiblePassword: boolean = false; // Para mostrar/ocultar la contraseña

  // Variables de control de formulario contraseña
  frormPassword!: FormGroup

  // Variables de control de formulario perfil
  formControlsPasswd: { [key: string]: AbstractControl | null } = {};

  constructor(
    public readonly form: FormShared,
    private readonly authService: AuthService,
    private readonly alertDialogService: AlertDialogService,
    private readonly alertToastService: AlertToastService,
    private readonly userService: UserService,
    private readonly sidebarService: SidebarService,
    private readonly formBuilder: FormBuilder,
    private readonly calendarService: CalendarService,
    private readonly converterService: ConverterService,
    private readonly genericService: GenericService,

  ) {
    this.session = new SessionShared(this.authService);
    this.sidebar = new SidebarShared(this.sidebarService);

    this.initForm();
  }

  // Validaciones
  initForm(): void {
    // Validaciones de formulario perfil
    this.frormProfile = this.formBuilder.group({
      email_user: ['', [Validators.required, Validators.pattern(/^[\w-ñÑ]+(?:\.[\w-ñÑ]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/)]],
    });

    this.formControlsProfile = this.converterService.initializeFormControls(this.frormProfile);

    // Validaciones de formulario perfil
    this.frormPassword = this.formBuilder.group({
      password_user: ['', Validators.required],
      new_password: ['', [Validators.required, this.securePasswordValidator]],
    });

    this.formControlsPasswd = this.converterService.initializeFormControls(this.frormPassword);
  }

  ngOnInit(): void {
    // Cargar datos del usuario en el perfil
    this.getDataProfile();
  }

  ngOnDestroy(): void {
    // Desuscribirse del Subject al destruir el componente para evitar posibles fugas de memoria
    this.sidebar.destroy();
  }

  //===================================================================
  // Obtener datos del perfil
  //===================================================================

  // Cargar datos en el perfil
  getDataProfile() {
    if (this.session.id_user) {
      this.genericService.getId<UserResult>('user', this.session.id_user).subscribe({
        next: (response) => {
          console.log(response)
          const user: UserResult = response; // Obtener el objeto de usuario

          // Establecer los valores obtenidos en los campos del formulario
          this.frormProfile.patchValue({
            email_user: user.email_user,
          });

          this.firstname_user = user.firstname_user;
          this.lastname_user = user.lastname_user;
          this.identification_user = user.identification_user;
          if (user.role) this.name_role = user.role.name_role;
        }
      });
    }
  }

  //===================================================================
  // Actualizar formularios
  //===================================================================

  // Actualizar perfil
  updateProfile() {

    // Activar los mensajes de validacion del formulario
    this.frormProfile.markAllAsTouched();

    if (this.frormProfile.valid) {

      const formData: UserResult = this.frormProfile.value;

      if (this.form.onValidateChange(!this.frormProfile.dirty)) return;

      this.alertDialogService.AlertDialog({
        type: 'question',
        title: '¿Seguro que desea actualizar sus datos?',
        description: 'Los datos se actualizaran inmediatamente.',
        onConfirm: async () => {
          this.userService.updateProfileById(this.session.id_user, formData).subscribe({
            next: (response) => {
              this.alertToastService.AlertToast({
                type: "success",
                title: 'Datos actualizados exitosamente',
                description: response.msg,
              });
            }
          })
        },
        onCancel: () => console.log('Cancelado')
      })
    }
  }

  // Actualizar contraseñas
  updatePassword() {

    // Activar los mensajes de validacion del formulario
    this.frormPassword.markAllAsTouched();

    if (this.frormPassword.valid) {
      const formData: PasswdChangeResults = this.frormPassword.value;

      this.alertDialogService.AlertDialog({
        type: 'question',
        title: '¿Seguro que desea cambiar la contraseña?',
        description: 'La contraseña se actualizara inmediatamente.',
        onConfirm: async () => {
          this.userService.updatePasswordById(this.session.id_user, formData).subscribe({
            next: (response) => {
              this.alertToastService.AlertToast({
                type: "success",
                title: 'Contraseña actualizada exitosamente',
                description: response.msg,
              });

              // Limpiar formulario
              this.frormPassword.reset();
            }
          })
        },
        onCancel: () => console.log('Cancelado')

      })
    }
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
        securePassword: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.'
      };
    }

    return null;
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
