import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    HostListener,
    NgZone,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
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
