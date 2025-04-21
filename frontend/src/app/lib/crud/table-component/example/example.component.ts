import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { JTableComponent } from '../table.component';
import { OptionsTable, TableColumn } from '../elements/table.interface';
import { Ban, Cpu, Edit, LucideAngularModule, Plus, Power, Trash } from 'lucide-angular';
import { JFormComponent, FormType } from '../../form-component/form.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenericService } from '../../elements/crud-generic.service';
import { JInputComponent } from 'src/app/lib/input/input.component';
import { JSelectComponent } from 'src/app/lib/select/select.component';
import { AlertToastService } from 'src/app/lib/alert-toast/elements/alert-toast.service';
import { JLabelComponent } from 'src/app/lib/label/label.component';
import { ErrorMessageComponent } from '../../form-component/components/error-message/error-message.component';
import { ContentFormComponent } from '../../form-component/components/content-form/content-form.component';
import { AlertDialogService } from 'src/app/lib/alert-dialog/elements/alert-dialog.service';
import { ConverterService } from '../../elements/converter.service';
import { FilterButton, FilterSelect } from '../../filter-component/elements/filter.interface';

interface User {
  id_user: number;
  firstname_user: string;
  lastname_user: string;
  identification_user: string;
  email_user: string;
  role: { name_role: string };
  status: { name_status: string };
  is_active_user: boolean;
  balance_user: number;
  creationDate_user: string;
}

@Component({
  selector: 'app-table-example',
  imports: [LucideAngularModule, JTableComponent, JFormComponent, CommonModule, ReactiveFormsModule, JInputComponent, JSelectComponent, JLabelComponent, ErrorMessageComponent, ContentFormComponent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TableExampleComponent {

  // Lucide icons
  icons = {
    add: Plus,
    edit: Edit,
    delete: Trash,
    ban: Ban,
    power: Power,
    default: Cpu
  };

  // Nombre de endpoint
  endpoint: string = 'user';
  isLoading: boolean = false;

  // ======================================================
  // Columnas de tabla
  // ======================================================

  columns: TableColumn<User>[] = [
    {
      key: 'id_user',
      label: 'ID',
      sortable: false,
      visible: false,
      isSearchable: false,
    },
    {
      key: 'lastname_user',
      label: 'Nombre'
    },
    {
      key: 'firstname_user',
      label: 'Apellido'
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
    // {
    //   key: 'is_active_user',
    //   label: 'Activo',
    //   isDisaled: true,
    //   isSearchable: false,
    //   styles: { 'text-align': 'center' }
    // },
    // {
    //   key: 'balance_user',
    //   label: 'Balance',
    //   isCurrency: true,
    //   styles: { 'text-align': 'center' }
    // },
    {
      key: 'creationDate_user',
      label: 'Fecha de Creación',
      isSearchable: false,
      isDate: true,
      styles: { 'text-align': 'center' }
    }
  ];

  // ======================================================
  // Botones de tabla
  // ======================================================

  filtersButton: FilterButton[] = [
    {
      icon: this.icons.add,
      tooltip: 'Nuevo',
      clicked: () => {
        this.typeForm = 'create';
        this.onOpen()
      },
      classes: 'primary'
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

  // ======================================================
  // Filtros de tabla
  // ======================================================

  filtersSelect: FilterSelect[] = [
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
    {
      type: 'searchable',
      selected: null,
      endpoint: 'status',
      optionLabel: 'name_status',
      optionValue: 'id_status',
      loadOnInit: false,
      isSearch: false,
      placeholder: 'Estados...',
      showClear: true
    },
    // {
    //   type: 'dropdown',
    //   selectedRoleId: null,
    //   onRoleSelected: (value: any) => console.log('Filtro dinámico seleccionado (role):', value),
    //   options: [
    //     { id_role: 1, name_role: 'Admin' },
    //     { id_role: 2, name_role: 'User' }
    //   ],
    //   optionLabel: 'name_role',
    //   optionValue: 'id_role',
    //   placeholder: 'Roles...',
    //   showClear: true,
    // }
  ]


  // =========================================================
  // Formulario
  // =========================================================

  // Abrir formulario
  @ViewChild(JTableComponent) tableComponent!: JTableComponent;
  openForm: boolean = false;
  typeForm: FormType = 'create';
  formGroup!: FormGroup;

  // Variables de control de formulario perfil
  formControls: { [key: string]: AbstractControl | null } = {};
  messages: { title: string, description: string } | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly genericService: GenericService,
    private readonly alertToastService: AlertToastService,
    private readonly alertDialogService: AlertDialogService,
    private readonly converterService: ConverterService,
  ) {
    this.initForm();
  }


  // Validaciones
  initForm(): void {
    this.formGroup = this.formBuilder.group({
      id_user: [null],
      firstname_user: ["", [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+(?: [a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+)*$/)],],
      lastname_user: ["", [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+(?: [a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+)*$/)],],
      identification_user: ["", Validators.required],
      email_user: ["", [Validators.required, Validators.pattern(/^[\w-ñÑ]+(?:\.[\w-ñÑ]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/)],],
      id_role: [null, Validators.required],
    })

    this.formControls = this.converterService.initializeFormControls(this.formGroup);
  }

  // Abrir formulario
  onOpen() {
    this.openForm = true;
    this.formGroup.reset();
  }

  // Cerrar formulario
  onCloseForm() {
    this.openForm = false;
  }

  onTableDataLoaded() {
    this.isLoading = false;
    this.openForm = false;

    if (this.messages) {
      this.alertToastService.AlertToast({
        type: "success",
        ...this.messages
      });

      this.messages = null;
    }
  }

  // Enviar formulario
  onSubmitForm(): void {
    this.formGroup.markAllAsTouched();

    const formData = {
      ...this.formGroup.value,
    }

    if (this.formGroup.valid) {
      this.isLoading = true;

      const isNew = !formData[`id_${this.endpoint}`];
      const action$ = isNew
        ? this.genericService.create<any>(this.endpoint, formData)
        : this.genericService.update<any>(this.endpoint, formData.id_user, formData);

      action$.subscribe({
        next: (response) => {
          // Guardamos el mensaje y esperamos a que cargue la tabla
          this.messages = {
            title: isNew ? "Usuario creado" : "Usuario actualizado",
            description: response.msg
          };

          this.tableComponent?.loadData();
        },
        error: (error) => {
          this.isLoading = false;
        }
      })
    }
  }


  // =========================================================
  // Opciones de tabla
  // =========================================================

  optionsTable: OptionsTable[] = [
    {
      icon: this.icons.edit,
      tooltip: 'Editar',
      clicked: (data) => {
        this.typeForm = 'update';
        this.onEdit(data);
        console.log('Editar:', data);
      },
      classes: 'warning_secondary'
    },
    {
      icon: this.icons.delete,
      tooltip: 'Eliminar',
      clicked: (data) => {
        this.onDelete(data);
        console.log('Eliminar:', data);
      },
      classes: 'error_secondary'
    },
    {
      icon: (data: any) => data.id_status === 1 ? this.icons.ban : this.icons.power,
      tooltip: (data) => data.id_status === 1 ? 'Desactivar' : 'Activar',
      clicked: (data) => {
        this.onEnabled(data);
        console.log('Desactivar:', data);
      },
      classes: ''
    },

  ];

  // Editar
  onEdit(data: any) {
    // Abrir formulario
    this.onOpen();

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

  // Eliminar
  onDelete(data: any) {
    this.alertDialogService.AlertDialog({
      type: 'question',
      title: "Eliminar usuario",
      description: "¿Está seguro de eliminar este usuario?",
      onConfirm: async () => {

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

  // Activar/Desactivar
  onEnabled(data: any) {
    const status = data.id_status === 1 ? 2 : 1;
    const message = data.id_status === 1 ? 'desactivado' : 'activado';

    this.alertDialogService.AlertDialog({
      type: 'question',
      title: `Usuario ${message}`,
      description: `¿Está seguro de ${message} este usuario?`,
      onConfirm: async () => {

        // this.genericService.update<any>(this.endpoint, data.id_user, { id_status: status }).subscribe({
        //   next: (response) => {
        //     this.alertToastService.AlertToast({
        //       type: "success",
        //       title: `Usuario ${message}`,
        //       description: response.msg
        //     });

        //     this.tableComponent?.loadData();
        //   }
        // })

      },
      onCancel() {
        console.log('Cancelar activación/desactivación');
      }
    })
  }

}
