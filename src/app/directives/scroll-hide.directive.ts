import { Directive, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollHide]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '(ionScroll)': 'onContentScroll($event)' // Detect scroll on ion-content to trigger
  }
})
export class ScrollHideDirective implements AfterViewInit {

  private header: Element;
  private footer: Element;
  private triggerDistance: number;
  private hiding: boolean;

  constructor(public element: ElementRef, public renderer: Renderer2) {
    console.log('Hello ScrollHide Directive');
    this.triggerDistance = 20;
    this.hiding = false;
  }

  // Initial setup
  ngAfterViewInit() {
    this.header = document.getElementById('page-header');
    this.renderer.setStyle(this.header, 'webkitTransition', 'top 700ms');
    this.renderer.setStyle(this.header, 'webkitTransition', 'top 700ms');
    this.footer = document.getElementById('page-footer');
    this.renderer.setStyle(this.footer, 'webkitTransition', 'bottom 700ms');
  }

  // When scrolling
  onContentScroll(event) {

    const distance = event.detail.deltaY;

    if (event.detail.velocityY > 0 && (distance > this.triggerDistance)) {
      // We're scrolling down past the anti-bounce trigger point
      this.renderer.setStyle(this.header, 'top', '-114px');
      this.renderer.setStyle(this.footer, 'bottom', '-50px');
      this.hiding = true;
    } else if (event.detail.velocityY > 0 && this.hiding) {
      // We're scrolling down again
      this.renderer.setStyle(this.header, 'top', '-114px');
      this.renderer.setStyle(this.footer, 'bottom', '-50px');
    } else {
      // We're scrolling up
      this.renderer.setStyle(this.header, 'top', '0px');
      this.renderer.setStyle(this.footer, 'bottom', '0px');
      this.hiding = false;
    }

  }

}
