import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective {
  @Input() tooltip = '';

  private tooltipComponent?: ComponentRef<any>;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    console.log('onMouseEnter');
    if (this.tooltipComponent) {
      return;
    }

    this.tooltipComponent = this.viewContainerRef.createComponent(TooltipComponent);
    this.document.body.appendChild(
      this.tooltipComponent.location.nativeElement
    );
    this.setTooltipComponentProperties();
    this.tooltipComponent.hostView.detectChanges();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    console.log('onMouseLeave');
    if (!this.tooltipComponent) {
      return;
    }
    this.appRef.detachView(this.tooltipComponent.hostView);
    this.tooltipComponent.destroy();
    this.tooltipComponent = undefined;
  }

  private setTooltipComponentProperties() {
    if (!this.tooltipComponent) {
      return;
    }
    this.tooltipComponent.setInput('text', this.tooltip);
    const { left, right, bottom } = this.elementRef.nativeElement.getBoundingClientRect();
    this.tooltipComponent.setInput('left', (right - left) / 2 + left);
    this.tooltipComponent.setInput('top', bottom);
  }
}
