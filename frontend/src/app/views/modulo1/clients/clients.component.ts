import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
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
import { FilterButton } from 'src/app/lib/crud/filter-component/elements/filter.interface';
import { ClientResult } from 'src/app/core/interfaces/entities/client.interface';
import { ClientService } from 'src/app/core/services/content/client.service';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, ReactiveFormsModule, JTableComponent, JFormComponent, JInputComponent, JLabelComponent, ErrorMessageComponent, JContentFormComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {

  session!: SessionShared;

  // Nombre de endpoint
  endpoint: string = 'client';

  // Elementos de crud
  columns: TableColumn<ClientResult>[] = [];
  filtersButton: FilterButton[] = [];
  optionsTable: OptionsTable[] = [];

  constructor(
    public readonly form: FormShared,
    public readonly dialog: DialogShared,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly genericService: GenericService,
    private readonly alertToastService: AlertToastService,
    private readonly alertDialogService: AlertDialogService,
    private readonly converterService: ConverterService,
    private readonly clientService: ClientService,
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
    this.initOptionsTable();
    this.initForm();
  }

  // ======================================================
  // Columnas de tabla
  // ======================================================

  initColumns() {
    this.columns = [
      {
        key: 'id_client',
        label: 'ID',
        sortable: false,
        visible: false,
        isSearchable: false,
      },
      {
        key: 'firstname_client',
        label: 'Apellido',
      },
      {
        key: 'lastname_client',
        label: 'Nombre'
      },
      {
        key: 'identification_client',
        label: 'Identificaciòn',
        styles: { textAlign: 'center' }
      },
      {
        key: 'email_client',
        label: 'Correo'
      },
      {
        key: 'phone_client',
        label: 'Telèfono',
        styles: { textAlign: 'center' }
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
        type: 'clear',
        tooltip: 'Limpiar filtros'
      },
    ];
  }

  // =========================================================
  // Opciones de tabla
  // =========================================================

  initOptionsTable() {
    this.optionsTable = [
      {
        icon: this.form.icons.edit,
        tooltip: 'Editar',
        clicked: (data) => {
          this.form.typeForm = 'update';
          this.onEdit(data);
        },
        classes: 'warning_secondary',
        disabled: (data) =>
          this.session.id_user !== 1,
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
          data.id_user === this.session.id_user,
        isVisible: () => this.session.role_user === 1,
      },
    ];
  }

  // =========================================================
  // Funciones de opciones de tabla
  // =========================================================

  // Editar
  onEdit(data: ClientResult) {
    // Abrir formulario
    this.form.onOpen();

    // Obtener datos
    this.formGroup.patchValue({
      id_client: data.id_client,
      firstname_client: data.firstname_client,
      lastname_client: data.lastname_client,
      identification_client: data.identification_client,
      phone_client: data.phone_client,
      email_client: data.email_client,
    })
  }

  // Activar/Desactivar
  onEnabled(data: ClientResult) {
    if (!data.id_client) return;

    const id = data.id_client;
    const isActive = data.id_status === 1;
    const message = isActive ? 'desactivar' : 'activar';
    const message2 = isActive ? 'desactivado' : 'activado';

    const serviceCall = isActive
      ? () => this.clientService.deactivateClient(id)
      : () => this.clientService.activateClient(id);

    this.alertDialogService.AlertDialog({
      type: 'question',
      title: `${message.charAt(0).toUpperCase() + message.slice(1)} cliente`,
      description: `¿Está seguro de ${message} el cliente <br><b>${data.firstname_client} ${data.lastname_client}</b>?`,
      onConfirm: async () => {

        serviceCall().subscribe({
          next: (response) => {
            this.alertToastService.AlertToast({
              type: "success",
              title: `Cliente ${message2}`,
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
  onDelete(data: ClientResult) {
    this.alertDialogService.AlertDialog({
      type: 'question',
      title: "Eliminar cliente",
      description: `¿Está seguro de eliminar el cliente <br><b>${data.firstname_client} ${data.lastname_client}</b>?`,
      onConfirm: async () => {

        if (!data.id_client) return;
        this.genericService.delete<ClientResult>(this.endpoint, data.id_client).subscribe({
          next: (response) => {
            this.alertToastService.AlertToast({
              type: "success",
              title: "Cliente eliminado",
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
      id_client: null,
      firstname_client: ['', Validators.required],
      lastname_client: ['', Validators.required],
      identification_client: ['', Validators.required],
      phone_client: ['', Validators.required],
      email_client: ['', Validators.required],
    })

    this.form.formControls = this.converterService.initializeFormControls(this.formGroup);
  }

  // Enviar formulario
  onSubmitForm(): void {
    this.formGroup.markAllAsTouched();

    const formData = {
      ...this.formGroup.value,
      ...(!this.formGroup.value.id_client ? {id_user: this.session.id_user} : {}),
    }

    if (this.formGroup.valid) {
      const isNew = !formData[`id_${this.endpoint}`];
      if (this.form.onValidateChange(!isNew && !this.formGroup.dirty)) return;

      this.form.isLoading = true;
      const action$ = isNew
        ? this.genericService.create<ClientResult>(this.endpoint, formData)
        : this.genericService.update<ClientResult>(this.endpoint, formData.id_client, formData);

      action$.subscribe({
        next: (response) => {
          // Guardamos el mensaje y esperamos a que cargue la tabla
          this.form.messages = {
            title: isNew ? "Cliente creado" : "Cliente actualizado",
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

