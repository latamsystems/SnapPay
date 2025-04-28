 
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


import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TooltipService {
    private tooltipElement: HTMLElement | null = null;
    private arrowElement: HTMLElement | null = null;
    private readonly renderer: Renderer2;
    private showArrow: boolean = true;
    private offsetX = 0;
    private offsetY = 0;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    show(
        content: string | HTMLElement,
        target: HTMLElement,
        position: string = 'top',
        showArrow: boolean = true,
        offsetX: number = 0,
        offsetY: number = 0
    ) {
        if (!content || !target) return;

        this.hide();
        this.showArrow = showArrow;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        if (!this.tooltipElement) {
            this.tooltipElement = this.renderer.createElement('div');
            this.renderer.addClass(this.tooltipElement, 'j-tooltip');
            this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
            this.renderer.setStyle(this.tooltipElement, 'z-index', '9999');
            this.renderer.setStyle(this.tooltipElement, 'background-color', '#333');
            this.renderer.setStyle(this.tooltipElement, 'color', 'white');
            this.renderer.setStyle(this.tooltipElement, 'padding', '0.5rem');
            this.renderer.setStyle(this.tooltipElement, 'border-radius', '0.25rem');
            this.renderer.setStyle(this.tooltipElement, 'font-size', '0.875rem');
            this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
            this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 2px 4px rgba(0,0,0,0.2)');
            this.renderer.setStyle(this.tooltipElement, 'max-width', '230px');
            this.renderer.setStyle(this.tooltipElement, 'word-wrap', 'break-word');
            this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s ease, transform 0.2s ease');

            this.arrowElement = this.renderer.createElement('div');
            this.renderer.setStyle(this.arrowElement, 'position', 'absolute');
            this.renderer.setStyle(this.arrowElement, 'width', '0');
            this.renderer.setStyle(this.arrowElement, 'height', '0');
            this.renderer.setStyle(this.arrowElement, 'border-style', 'solid');
        }

        if (this.tooltipElement) {
            while (this.tooltipElement.firstChild) {
                this.tooltipElement.removeChild(this.tooltipElement.firstChild);
            }
        }

        if (typeof content === 'string') {
            this.tooltipElement!.textContent = content;
        } else if (content instanceof HTMLElement) {
            this.renderer.appendChild(this.tooltipElement!, content.cloneNode(true));
        }

        if (this.showArrow) {
            this.renderer.appendChild(this.tooltipElement!, this.arrowElement!);
        }

        this.renderer.appendChild(document.body, this.tooltipElement);
        this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
        this.renderer.setStyle(this.tooltipElement, 'transform', 'scale(1)');
        this.renderer.setStyle(this.tooltipElement, 'display', 'block');

        this.positionAbsolute(target, position);

        requestAnimationFrame(() => {
            this.renderer.setStyle(this.tooltipElement!, 'opacity', '1');
        });
    }

    positionAbsolute(target: HTMLElement, position: string) {
        if (!this.tooltipElement) return;

        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        let left = 0;
        let top = 0;
        const arrowSize = 6;

        if (this.showArrow && this.arrowElement) {
            this.renderer.setStyle(this.arrowElement, 'border-width', `${arrowSize}px`);
            this.renderer.setStyle(this.arrowElement, 'border-color', 'transparent');
            this.renderer.setStyle(this.arrowElement, 'top', '');
            this.renderer.setStyle(this.arrowElement, 'bottom', '');
            this.renderer.setStyle(this.arrowElement, 'left', '');
            this.renderer.setStyle(this.arrowElement, 'right', '');
        }

        switch (position) {
            case 'top':
                left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + this.offsetX;
                top = targetRect.top - tooltipRect.height - arrowSize + this.offsetY;
                if (this.showArrow && this.arrowElement) {
                    this.renderer.setStyle(this.arrowElement, 'bottom', `-5px`);
                    this.renderer.setStyle(this.arrowElement, 'left', `calc(50% - ${arrowSize}px)`);
                    this.renderer.setStyle(this.arrowElement, 'border-top-color', '#333');
                    this.renderer.setStyle(this.arrowElement, 'border-bottom-width', '0');
                }
                break;

            case 'bottom':
                left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2 + this.offsetX;
                top = targetRect.bottom + arrowSize + this.offsetY;
                if (this.showArrow && this.arrowElement) {
                    this.renderer.setStyle(this.arrowElement, 'top', `-5px`);
                    this.renderer.setStyle(this.arrowElement, 'left', `calc(50% - ${arrowSize}px)`);
                    this.renderer.setStyle(this.arrowElement, 'border-bottom-color', '#333');
                    this.renderer.setStyle(this.arrowElement, 'border-top-width', '0');
                }
                break;

            case 'left':
                left = targetRect.left - tooltipRect.width - arrowSize + this.offsetX;
                top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2 + this.offsetY;
                if (this.showArrow && this.arrowElement) {
                    this.renderer.setStyle(this.arrowElement, 'right', `-5px`);
                    this.renderer.setStyle(this.arrowElement, 'top', `calc(50% - ${arrowSize}px)`);
                    this.renderer.setStyle(this.arrowElement, 'border-left-color', '#333');
                    this.renderer.setStyle(this.arrowElement, 'border-right-width', '0');
                }
                break;

            case 'right':
                left = targetRect.right + arrowSize + this.offsetX;
                top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2 + this.offsetY;
                if (this.showArrow && this.arrowElement) {
                    this.renderer.setStyle(this.arrowElement, 'left', `-5px`);
                    this.renderer.setStyle(this.arrowElement, 'top', `calc(50% - ${arrowSize}px)`);
                    this.renderer.setStyle(this.arrowElement, 'border-right-color', '#333');
                    this.renderer.setStyle(this.arrowElement, 'border-left-width', '0');
                }
                break;
        }

        this.renderer.setStyle(this.tooltipElement, 'left', `${left + window.scrollX}px`);
        this.renderer.setStyle(this.tooltipElement, 'top', `${top + window.scrollY}px`);
    }

    hide() {
        if (this.tooltipElement) {
            this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
            this.renderer.setStyle(this.tooltipElement, 'transform', 'scale(0.95)');
            this.renderer.setStyle(this.tooltipElement, 'display', 'none');
        }
    }
}