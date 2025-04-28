
// ===============================================
// Librería de Componentes y Funciones - tailjNg
// ===============================================
// Descripción:
//   Esta librería está diseñada para ofrecer un conjunto de componentes reutilizables y funciones
//   optimizadas para facilitar el desarrollo de interfaces de usuario y la gestión de datos en aplicaciones 
//   web. Incluye herramientas para mejorar la experiencia del desarrollador y la interacción con el usuario.
// Propósito:
//   - Crear componentes modulares y personalizables.
//   - Mejorar la eficiencia del desarrollo front-end mediante herramientas reutilizables.
//   - Proporcionar soluciones escalables y fáciles de integrar con aplicaciones existentes.
// Uso:
//   Para obtener la funcionalidad completa, simplemente importa los módulos necesarios y usa los 
//   componentes según tu caso de uso. Asegúrate de revisar la documentación oficial para obtener ejemplos 
//   detallados sobre su implementación y personalización.
// Autores:
//   Armando Josue Velasquez Delgado - Desarrollador principal
// Licencia:
//   Este proyecto está licenciado bajo la MIT - ver el archivo LICENSE para más detalles.
// Versión: 0.0.9
// Fecha de creación: 2025-01-04
// =============================================== 


import { Directive, ElementRef, Input, OnDestroy, HostListener, NgZone, TemplateRef, ViewContainerRef } from '@angular/core';
import { TooltipService } from './tooltip.service';

@Directive({
    selector: '[jTooltip]',
    standalone: true,
})
export class JTooltipModule implements OnDestroy {
    @Input('jTooltip') content!: string | TemplateRef<any>;
    @Input() jTooltipPosition: 'top' | 'right' | 'bottom' | 'left' = 'top';
    @Input() jTooltipShowArrow: boolean = true;
    @Input() jTooltipOffsetX: number = 0;
    @Input() jTooltipOffsetY: number = 0;

    constructor(
        private readonly el: ElementRef,
        private readonly tooltipService: TooltipService,
        private readonly zone: NgZone,
        private readonly viewContainerRef: ViewContainerRef
    ) { }

    @HostListener('mouseenter')
    show() {
        if (!this.content) return;

        this.zone.runOutsideAngular(() => {
            let finalContent: string | HTMLElement = '';

            if (this.content instanceof TemplateRef) {
                const view = this.content.createEmbeddedView({});
                this.viewContainerRef.insert(view);
                view.detectChanges();

                const fragment = document.createElement('div');
                view.rootNodes.forEach((node) => fragment.appendChild(node.cloneNode(true)));
                finalContent = fragment;
                view.destroy(); // limpieza inmediata
            } else {
                finalContent = this.content;
            }

            this.tooltipService.show(
                finalContent,
                this.el.nativeElement,
                this.jTooltipPosition,
                this.jTooltipShowArrow,
                this.jTooltipOffsetX,
                this.jTooltipOffsetY
            );
        });
    }

    @HostListener('mouseleave')
    hide() {
        this.zone.runOutsideAngular(() => {
            this.tooltipService.hide();
        });
    }

    ngOnDestroy() {
        this.tooltipService.hide();
    }
}
