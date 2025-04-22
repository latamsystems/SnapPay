import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserResult } from 'src/app/core/interfaces/entities/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/content/user.service';
import { CalendarService } from 'src/app/core/services/static/transformer/calendar.service';
import { DialogShared } from 'src/app/core/shared/dialog.shared';
import { FormShared } from 'src/app/core/shared/form.shared';
import { SessionShared } from 'src/app/core/shared/session.shared';
import { AlertDialogService } from 'src/app/lib/alert-dialog/elements/alert-dialog.service';
import { AlertToastService } from 'src/app/lib/alert-toast/elements/alert-toast.service';
import { ConverterService } from 'src/app/lib/crud/elements/converter.service';
import { GenericService } from 'src/app/lib/crud/elements/crud-generic.service';
import { JContentFormComponent } from 'src/app/lib/crud/form-component/components/content-form/content-form.component';
import { ErrorMessageComponent } from 'src/app/lib/crud/form-component/components/error-message/error-message.component';
import { JFormComponent } from 'src/app/lib/crud/form-component/form.component';
import { OptionsTable, TableColumn } from 'src/app/lib/crud/table-component/elements/table.interface';
import { JTableComponent } from 'src/app/lib/crud/table-component/table.component';
import { JInputComponent } from 'src/app/lib/input/input.component';
import { JLabelComponent } from 'src/app/lib/label/label.component';
import { JSelectComponent } from 'src/app/lib/select/select.component';
import { FilterButton, FilterSelect } from 'src/app/lib/crud/filter-component/elements/filter.interface';

@Component({
  selector: 'app-users',
  imports: [CommonModule, ReactiveFormsModule, JTableComponent, JFormComponent, JInputComponent, JSelectComponent, JLabelComponent, ErrorMessageComponent, JContentFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {

  session!: SessionShared;

  // Nombre de endpoint
  endpoint: string = 'user';

  // Elementos de crud
  columns: TableColumn<UserResult>[] = [];
  filtersButton: FilterButton[] = [];
  filtersSelect: FilterSelect[] = [];
  optionsTable: OptionsTable[] = [];

  constructor(
    public readonly form: FormShared,
    public readonly dialog: DialogShared,
    private readonly formBuilder: FormBuilder,
    private readonly currencyPipe: CurrencyPipe,
    private readonly authService: AuthService,
    private readonly genericService: GenericService,
    private readonly alertToastService: AlertToastService,
    private readonly alertDialogService: AlertDialogService,
    private readonly converterService: ConverterService,
    private readonly userService: UserService,
    private readonly calendarService: CalendarService,
  ) {
    this.session = new SessionShared(this.authService);
    this.form.onResetCallback = () => this.formGroup.reset();
  }

  ngOnInit(): void {
    // Escucha eventos de socket
    this.genericService.listenToMany(this.endpoint, ['created', 'updated', 'deleted', 'deactivate', 'activate']).subscribe(({ event, data }) => {
      this.tableComponent?.loadData();
    });

    // Inicializa los elementos del crud
    this.initColumns();
    this.initFilterButton();
    this.initSelectFilter();
    this.initOptionsTable();
    this.initForm();
  }

  // ======================================================
  // Columnas de tabla
  // ======================================================

  initColumns() {
    this.columns = [
      {
        key: 'id_user',
        label: 'ID',
        sortable: false,
        visible: false,
        isSearchable: false,
      },
      {
        key: 'firstname_user',
        label: 'Nombre'
      },
      {
        key: 'lastname_user',
        label: 'Apellido'
      },
      {
        key: 'identification_user',
        label: 'Cédula',
        styles: { 'text-align': 'center' }
      },
      {
        key: 'email_user',
        label: 'Correo Electrónico'
      },
      {
        key: 'role.name_role',
        label: 'Rol',
        isDecorator: true,
        styles: { 'text-align': 'center' }
      },
    ];
  }

  // ======================================================
  // Botones de tabla
  // ======================================================

  initFilterButton() {
    this.filtersButton = [
      {
        icon: this.form.icons.add,
        tooltip: 'Nuevo',
        clicked: () => {
          this.form.typeForm = 'create';
          this.form.onOpen()
        },
        classes: 'primary',
        isVisible: () => this.session.role_user === 1 || this.session.role_user === 2,
      },
      {
        type: 'filter',
        tooltip: 'Filtros',
      },
      {
        type: 'clear',
        tooltip: 'Limpiar filtros'
      },
    ];
  }

  // ======================================================
  // Filtros de tabla
  // ======================================================

  initSelectFilter() {
    this.filtersSelect = [
      {
        type: 'searchable',
        selected: null,
        endpoint: 'role',
        optionLabel: 'name_role',
        optionValue: 'id_role',
        loadOnInit: false,
        isSearch: false,
        placeholder: 'Roles...',
        showClear: true
      },
    ]
  }

  // =========================================================
  // Opciones de tabla
  // =========================================================

  initOptionsTable() {
    this.optionsTable = [
      {
        icon: this.form.icons.keyRound,
        tooltip: 'Restablecer clave',
        clicked: (data) => {
          this.onResetPasswd(data);
        },
        classes: 'teal_secondary',
        disabled: (data) => data.id_user === 1 && this.session.id_user !== 1,
        isVisible: () => this.session.role_user === 1,
      },
      {
        icon: this.form.icons.edit,
        tooltip: 'Editar',
        clicked: (data) => {
          this.form.typeForm = 'update';
          this.onEdit(data);
        },
        classes: 'warning_secondary',
        disabled: (data) =>
          this.session.id_user !== 1 &&
          (this.session.id_user !== 1 && data.id_user === 1) ||
          (this.session.role_user !== 1 && data.id_role === 1),
        isVisible: () =>
          this.session.role_user === 1 ||
          this.session.role_user === 2,
      },
      {
        icon: (data: any) => data.id_status === 1 ? this.form.icons.ban : this.form.icons.power,
        tooltip: (data) => data.id_status === 1 ? 'Desactivar' : 'Activar',
        clicked: (data) => {
          this.onEnabled(data);
        },
        classes: 'orange_secondary',
        disabled: (data) =>
          this.session.id_user !== 1 &&
          (this.session.id_user !== 1 && data.id_user === 1) ||
          (this.session.role_user !== 1 && data.id_role === 1) ||
          data.id_user === this.session.id_user,
        isVisible: () =>
          this.session.role_user === 1 ||
          this.session.role_user === 2,
      },
      {
        icon: this.form.icons.delete,
        tooltip: 'Eliminar',
        clicked: (data) => {
          this.onDelete(data);
        },
        classes: 'error_secondary',
        disabled: (data) =>
          this.session.id_user !== 1 &&
          (this.session.id_user !== 1 && data.id_user === 1) ||
          (this.session.role_user !== 1 && data.id_role === 1) ||
          data.id_user === this.session.id_user,

        isVisible: () => this.session.role_user === 1,
      },
    ];
  }

  // =========================================================
  // Funciones de opciones de tabla
  // =========================================================

  // Restablecer contraseña
  onResetPasswd(data: UserResult) {
    this.alertDialogService.AlertDialog({
      type: 'question',
      title: 'Restablecer contraseña',
      description: `¿Está seguro de restablecer la contraseña de <br><b>${data.firstname_user} ${data.lastname_user}</b>?`,
      onConfirm: async () => {

        if (!data.id_user) return;
        this.userService.resetPasswordUser(data.id_user, data.identification_user).subscribe({
          next: (response) => {
            this.alertToastService.AlertToast({
              type: 'success',
              title: 'Contraseña restablecida',
              description: response.msg,
            });
          }
        });

      },
      onCancel: () => console.log('Cancelar restablecimiento de contraseña'),
    })
  }

  // Variables para el dialogo de información
  dataDialog!: UserResult;
  titleDialog!: string;

  // Variables de conversión
  birth_format!: string;
  age_user!: number | null;
  salaty_format!: string | null;

  // Informacion
  onInfo(data: UserResult) {
    this.dataDialog = data;
    this.titleDialog = `${data.firstname_user} ${data.lastname_user}`;
  }

  // Editar
  onEdit(data: UserResult) {
    // Abrir formulario
    this.form.onOpen();

    // Obtener datos
    this.formGroup.patchValue({
      id_user: data.id_user,
      firstname_user: data.firstname_user,
      lastname_user: data.lastname_user,
      identification_user: data.identification_user,
      email_user: data.email_user,
      id_role: data.id_role,
    })
  }

  // Activar/Desactivar
  onEnabled(data: UserResult) {
    if (!data.id_user) return;

    const id = data.id_user;
    const isActive = data.id_status === 1;
    const message = isActive ? 'desactivar' : 'activar';
    const message2 = isActive ? 'desactivado' : 'activado';

    const serviceCall = isActive
      ? () => this.userService.deactivateUser(id)
      : () => this.userService.activateUser(id);

    this.alertDialogService.AlertDialog({
      type: 'question',
      title: `${message.charAt(0).toUpperCase() + message.slice(1)} usuario`,
      description: `¿Está seguro de ${message} el usuario <br><b>${data.firstname_user} ${data.lastname_user}</b>?`,
      onConfirm: async () => {

        serviceCall().subscribe({
          next: (response) => {
            this.alertToastService.AlertToast({
              type: "success",
              title: `Usuario ${message2}`,
              description: response.msg
            });

            this.tableComponent?.loadData();
          }
        });

      },
      onCancel: () => console.log('Cancelar activación/desactivación')
    });
  }

  // Eliminar
  onDelete(data: UserResult) {
    this.alertDialogService.AlertDialog({
      type: 'question',
      title: "Eliminar usuario",
      description: `¿Está seguro de eliminar el usuario <br><b>${data.firstname_user} ${data.lastname_user}</b>?`,
      onConfirm: async () => {

        if (!data.id_user) return;
        this.genericService.delete<any>(this.endpoint, data.id_user).subscribe({
          next: (response) => {
            this.alertToastService.AlertToast({
              type: "success",
              title: "Usuario eliminado",
              description: response.msg
            });

            this.tableComponent?.loadData();
          }
        })

      },
      onCancel() {
        console.log('Cancelar eliminación');
      }
    })
  }

  // =========================================================
  // Formulario
  // =========================================================

  @ViewChild(JTableComponent) tableComponent!: JTableComponent;
  formGroup!: FormGroup;

  // Validaciones
  initForm(): void {
    this.formGroup = this.formBuilder.group({
      id_user: null,
      firstname_user: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+(?: [a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+)*$/)]],
      lastname_user: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+(?: [a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+)*$/)]],
      identification_user: ['', Validators.required],
      email_user: ['', [Validators.required, Validators.pattern(/^[\w-ñÑ]+(?:\.[\w-ñÑ]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/)]],
      phone_user: ['', Validators.required],
      referencyPhone_user: [null],
      birth_user: ['', Validators.required],
      numberAccount_user: ['', Validators.required],
      salary_user: [null, Validators.required],
      daySalary_user: [null, Validators.required],
      location_user: [null],
      id_genre: [null, Validators.required],
      id_bank: [null, Validators.required],
      id_role: [null, Validators.required],
      id_office: [null, Validators.required],
    })

    this.form.formControls = this.converterService.initializeFormControls(this.formGroup);
  }

  // Enviar formulario
  onSubmitForm(): void {
    this.formGroup.markAllAsTouched();

    const formData = {
      ...this.formGroup.value,
    }

    if (this.formGroup.valid) {
      const isNew = !formData[`id_${this.endpoint}`];
      if (this.form.onValidateChange(!isNew && !this.formGroup.dirty)) return;

      this.form.isLoading = true;
      const action$ = isNew
        ? this.genericService.create<any>(this.endpoint, formData)
        : this.genericService.update<any>(this.endpoint, formData.id_user, formData);

      action$.subscribe({
        next: (response) => {
          // Guardamos el mensaje y esperamos a que cargue la tabla
          this.form.messages = {
            title: isNew ? "Usuario creado" : "Usuario actualizado",
            description: response.msg
          };

          this.tableComponent?.loadData();
        },
        error: (error) => {
          this.form.isLoading = false;
        }
      })
    }
  }
}
