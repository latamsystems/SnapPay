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
import { FilterButton, FilterSelect } from 'src/app/lib/crud/filter-component/elements/filter.interface';
import { ClientResult } from 'src/app/core/interfaces/entities/client.interface';
import { ClientService } from 'src/app/core/services/content/client.service';
import { DeviceResult } from 'src/app/core/interfaces/entities/device.interface';
import { JSelectComponent } from 'src/app/lib/select/select.component';
import { DeviceService } from 'src/app/core/services/content/device.service';

@Component({
  selector: 'app-devices',
  imports: [CommonModule, ReactiveFormsModule, JTableComponent, JFormComponent, JInputComponent, JLabelComponent, ErrorMessageComponent, JContentFormComponent, JSelectComponent],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent implements OnInit {


  session!: SessionShared;

  // Nombre de endpoint
  endpoint: string = 'device';

  // Elementos de crud
  columns: TableColumn<DeviceResult>[] = [];
  filtersButton: FilterButton[] = [];
  filtersSelect: FilterSelect[] = [];
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
    private readonly deviceService: DeviceService,
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
        key: 'id_device',
        label: 'ID',
        sortable: false,
        visible: false,
        isSearchable: false,
      },
      {
        key: 'model.brand.name_brand',
        label: 'Marca',
        styles: { textAlign: 'center' },
        isDecorator: true,
      },
      {
        key: 'model.name_model',
        label: 'Modelo',
        styles: { textAlign: 'center' },
      },
      {
        key: 'price_device',
        label: 'Precio',
        styles: { textAlign: 'center' },
        isDecorator: true,
        isCurrency: true,
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

          // Asignar datos al formulario automaticamente
          this.formGroup.get('id_user')?.setValue(this.session.id_user);
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
        endpoint: 'brand',
        optionLabel: 'name_brand',
        optionValue: 'id_brand',
        loadOnInit: false,
        isSearch: false,
        placeholder: 'Marcas...',
        showClear: true,
        deep: 'model',
      },
      {
        type: 'searchable',
        selected: null,
        endpoint: 'model',
        optionLabel: 'name_model',
        optionValue: 'id_model',
        loadOnInit: false,
        isSearch: false,
        placeholder: 'Modelos...',
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
  onEdit(data: DeviceResult) {
    // Abrir formulario
    this.form.onOpen();

    // Obtener datos
    this.formGroup.patchValue({
      id_device: data.id_device,
      price_device: data.price_device,
      id_model: data.id_model,
      id_user: data.id_user,
    })
  }

  // Activar/Desactivar
  onEnabled(data: DeviceResult) {
    if (!data.id_device) return;

    const id = data.id_device;
    const isActive = data.id_status === 1;
    const message = isActive ? 'desactivar' : 'activar';
    const message2 = isActive ? 'desactivado' : 'activado';

    const serviceCall = isActive
      ? () => this.deviceService.deactivateDevice(id)
      : () => this.deviceService.activateDevice(id);

    this.alertDialogService.AlertDialog({
      type: 'question',
      title: `${message.charAt(0).toUpperCase() + message.slice(1)} dispositivo`,
      description: `¿Está seguro de ${message} el dispositivo?`,
      onConfirm: async () => {

        serviceCall().subscribe({
          next: (response) => {
            this.alertToastService.AlertToast({
              type: "success",
              title: `Dispositivo ${message2}`,
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
  onDelete(data: DeviceResult) {
    this.alertDialogService.AlertDialog({
      type: 'question',
      title: "Eliminar dispositivo",
      description: `¿Está seguro de eliminar el dispositivo?`,
      onConfirm: async () => {

        if (!data.id_device) return;
        this.genericService.delete<ClientResult>(this.endpoint, data.id_device).subscribe({
          next: (response) => {
            this.alertToastService.AlertToast({
              type: "success",
              title: "Dispositivo eliminado",
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
      id_device: null,
      price_device: ['', Validators.required],
      id_model: [null, Validators.required],
      id_user: [null, Validators.required],
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
        ? this.genericService.create<DeviceResult>(this.endpoint, formData)
        : this.genericService.update<DeviceResult>(this.endpoint, formData.id_device, formData);

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
