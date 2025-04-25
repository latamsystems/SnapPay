import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/content/user.service';
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
import { ModelResult } from 'src/app/core/interfaces/entities/model.interface';

@Component({
  selector: 'app-models',
  imports: [CommonModule, ReactiveFormsModule, JTableComponent, JFormComponent, JInputComponent, JSelectComponent, JLabelComponent, ErrorMessageComponent, JContentFormComponent],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export class ModelsComponent implements OnInit {

  session!: SessionShared;

  // Nombre de endpoint
  endpoint: string = 'model';

  // Elementos de crud
  columns: TableColumn<ModelResult>[] = [];
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
    private readonly userService: UserService,
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
        key: 'id_model',
        label: 'ID',
        sortable: false,
        visible: false,
        isSearchable: false,
      },
      {
        key: 'name_model',
        label: 'Modelo de dispositivo'
      },
      {
        key: 'brand.name_brand',
        label: 'Marca',
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
        tooltip: 'Filtrar',
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
          this.session.id_user !== 1 &&
          (this.session.id_user !== 1 && data.id_user === 1) ||
          (this.session.role_user !== 1 && data.id_role === 1),
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
  onEdit(data: ModelResult) {
    // Abrir formulario
    this.form.onOpen();

    // Obtener datos
    this.formGroup.patchValue({
      id_model: data.id_model,
      name_model: data.name_model,
      id_brand: data.id_brand,
    })
  }

  // Eliminar
  onDelete(data: ModelResult) {
    this.alertDialogService.AlertDialog({
      type: 'question',
      title: "Eliminar modelo",
      description: `¿Está seguro de eliminar el modelo <br><b>${data.name_model}</b>?`,
      onConfirm: async () => {

        if (!data.id_model) return;
        this.genericService.delete<any>(this.endpoint, data.id_model).subscribe({
          next: (response) => {
            this.alertToastService.AlertToast({
              type: "success",
              title: "Modelo eliminado",
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
      id_model: null,
      name_model: ['', Validators.required],
      id_brand: [null, Validators.required],
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
        ? this.genericService.create<ModelResult>(this.endpoint, formData)
        : this.genericService.update<ModelResult>(this.endpoint, formData.id_model, formData);

      action$.subscribe({
        next: (response) => {
          // Guardamos el mensaje y esperamos a que cargue la tabla
          this.form.messages = {
            title: isNew ? "Modelo creado" : "Modelo actualizado",
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
