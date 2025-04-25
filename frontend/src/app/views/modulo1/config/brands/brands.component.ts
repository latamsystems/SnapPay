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
import { FilterButton } from 'src/app/lib/crud/filter-component/elements/filter.interface';
import { BrandResult } from 'src/app/core/interfaces/entities/brand.interface';

@Component({
  selector: 'app-brands',
  imports: [CommonModule, ReactiveFormsModule, JTableComponent, JFormComponent, JInputComponent, JLabelComponent, ErrorMessageComponent, JContentFormComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {

  session!: SessionShared;

  // Nombre de endpoint
  endpoint: string = 'brand';

  // Elementos de crud
  columns: TableColumn<BrandResult>[] = [];
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
    this.initOptionsTable();
    this.initForm();
  }

  // ======================================================
  // Columnas de tabla
  // ======================================================

  initColumns() {
    this.columns = [
      {
        key: 'id_brand',
        label: 'ID',
        sortable: false,
        visible: false,
        isSearchable: false,
      },
      {
        key: 'name_brand',
        label: 'Nombre de la marca'
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
  onEdit(data: BrandResult) {
    // Abrir formulario
    this.form.onOpen();

    // Obtener datos
    this.formGroup.patchValue({
      id_brand: data.id_brand,
      name_brand: data.name_brand,
    })
  }

  // Eliminar
  onDelete(data: BrandResult) {
    this.alertDialogService.AlertDialog({
      type: 'question',
      title: "Eliminar marca",
      description: `¿Está seguro de eliminar la marca <br><b>${data.name_brand}</b>?`,
      onConfirm: async () => {

        if (!data.id_brand) return;
        this.genericService.delete<any>(this.endpoint, data.id_brand).subscribe({
          next: (response) => {
            this.alertToastService.AlertToast({
              type: "success",
              title: "Marca eliminada",
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
      id_brand: null,
      name_brand: ['', Validators.required],
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
        ? this.genericService.create<BrandResult>(this.endpoint, formData)
        : this.genericService.update<BrandResult>(this.endpoint, formData.id_brand, formData);

      action$.subscribe({
        next: (response) => {
          // Guardamos el mensaje y esperamos a que cargue la tabla
          this.form.messages = {
            title: isNew ? "Marca creada" : "Marca actualizada",
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
