import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from 'src/app/core/services/auth.service';
import { ExamplesComponent } from '../../examples/examples.component';
import { SidebarService } from 'src/app/core/services/static/layout/sidebar.service';
import { SessionShared } from 'src/app/core/shared/session.shared';
import { SidebarShared } from 'src/app/core/shared/sidebar.shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgClass, TooltipModule, FileUploadModule, ExamplesComponent]
})
export class HomeComponent implements OnDestroy, AfterViewInit {

  session!: SessionShared;
  sidebar!: SidebarShared;

  constructor(
    private readonly authService: AuthService,
    // private readonly alertService: AlertService,
    // private readonly pdfService: PdfService,
    private readonly sidebarService: SidebarService
  ) {
    this.session = new SessionShared(this.authService);
    this.sidebar = new SidebarShared(this.sidebarService);
  }

  ngAfterViewInit(): void {
    this.initBlobs();
  }

  ngOnDestroy(): void {
    this.sidebar.destroy();
  }


  charge_gif_pdf: boolean = false;
  charge_gif_pdf2: boolean = false;

  //===================================================================
  // Boton Exportar en pdf
  //===================================================================
  // Exportar en pdf
  exportPDF() {
    setTimeout(() => {

      // Informacion que se requiere para el certificado de matricula
      const datos = {
        codeStudent: "M-085",
        codeDocument: "M-071",
        fistnameStudent: "FRANKLIN EFREN",
        lastnameStudent: "PINDO CARCHI",
        identificationStudent: "1722354261",
        courseStudent: "PRIMER AÑO DE BACHILLERATO GENERAL UNIFICADO",
        periodMatriculaStudent: "Enero - Mayo 2024",
      }

      // Nombre del documento
      const nameDoc = `${datos.identificationStudent} Certificado de matricula`;

      // Llamada al servicio de PDF
      // this.pdfService.generatePdfMatricula(nameDoc, datos)
      //   .then(() => {
      //     const title = 'Exportación exitosa';
      //     const message = 'El archivo PDF ha sido creado y descargado con éxito.';
      //     this.alertService.toastMessage('success', title, message);
      //     this.charge_gif_pdf = false;
      //   })
      //   .catch((error) => {
      //     const title = 'Error de Exportación';
      //     const message = 'Hubo un problema al crear el archivo PDF. Por favor, inténtelo de nuevo.';
      //     this.alertService.toastMessage('error', title, message);
      //     console.log(error);
      //     this.charge_gif_pdf = false;
      //   });
    }, 0);
  }

  exportPDF2() {
    setTimeout(() => {

      // Informacion que se requiere para el certificado de cupo
      const datos = {

        dateCertificate: '',

        executive: 'RECTOR(A)',
        institution: 'UNIDAD EDUCATIVA',
        nameExecutive: 'ARMANDO JOSUE VELASQUEZ DELGADO',
        nameInstitution: 'Ernesto Alban Mosquera',

        codeDocument: "0009",
        nameStudent: "CHIQUITO ALCIVAR ISABEL MARIUXI",
        identificationStudent: "1721248746",
        courseStudent: "TERCER BGU",
        periodMatriculaStudent: "Enero - Mayo 2024",
      }

      // Nombre del documento
      const nameDoc = `${datos.identificationStudent} Certificado de Cupo`;

      // // Llamada al servicio de PDF
      // this.pdfService.generatePdfCupo(nameDoc, datos)
      //   .then(() => {
      //     const title = 'Exportación exitosa';
      //     const message = 'El archivo PDF ha sido creado y descargado con éxito.';
      //     this.alertService.toastMessage('success', title, message);
      //     this.charge_gif_pdf2 = false;
      //   })
      //   .catch((error) => {
      //     const title = 'Error de Exportación';
      //     const message = 'Hubo un problema al crear el archivo PDF. Por favor, inténtelo de nuevo.';
      //     this.alertService.toastMessage('error', title, message);
      //     console.log(error);
      //     this.charge_gif_pdf2 = false;
      //   });
    }, 0);
  }







  //===================================================================
  // Contenido de animacion para usuarios
  //===================================================================

  initBlobs(): void {
    const MIN_SPEED = 1.5;
    const MAX_SPEED = 2.5;

    function randomNumber(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    class Blob {
      el: HTMLElement;
      size: number;
      initialX: number;
      initialY: number;
      vx: number;
      vy: number;
      x: number;
      y: number;

      constructor(el: HTMLElement) {
        this.el = el;
        const boundingRect = this.el.getBoundingClientRect();
        this.size = boundingRect.width;
        this.initialX = randomNumber(0, window.innerWidth - this.size);
        this.initialY = randomNumber(0, window.innerHeight - this.size);
        this.el.style.top = `${this.initialY}px`;
        this.el.style.left = `${this.initialX}px`;
        this.vx = randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
        this.vy = randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1);
        this.x = this.initialX;
        this.y = this.initialY;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x >= window.innerWidth - this.size) {
          this.x = window.innerWidth - this.size;
          this.vx *= -1;
        }
        if (this.y >= window.innerHeight - this.size) {
          this.y = window.innerHeight - this.size;
          this.vy *= -1;
        }
        if (this.x <= 0) {
          this.x = 0;
          this.vx *= -1;
        }
        if (this.y <= 0) {
          this.y = 0;
          this.vy *= -1;
        }
      }

      move() {
        this.el.style.transform = `translate(${this.x - this.initialX}px, ${this.y - this.initialY}px)`;
      }
    }

    function initBlobs() {
      const blobEls = document.querySelectorAll('.bouncing-blob');
      const blobs = Array.from(blobEls).map(blobEl => new Blob(blobEl as HTMLElement));

      function update() {
        requestAnimationFrame(update);
        blobs.forEach(blob => {
          blob.update();
          blob.move();
        });
      }

      requestAnimationFrame(update);
    }

    initBlobs();
  }
}
