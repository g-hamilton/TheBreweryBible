import { Directive, Renderer2, OnInit } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appScrollHide]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '(ionScroll)': 'onContentScroll($event)' // Detect scroll on ion-content to trigger
  }
})
export class ScrollHideDirective implements OnInit {

  private header: Element;
  private footer: Element;
  private triggerDistance = 20;
  private hidden = false;

  constructor(
    private renderer: Renderer2,
    private domCtrl: DomController
    ) {
    console.log('Hello ScrollHide Directive');
  }

  ngOnInit() {
    this.initStyles();
  }

  initStyles() {
    /*
    Initial setup. Using domCtrl to write to the DOM at the most efficient time for better performance.
    */
    this.domCtrl.write(() => {
      this.header = document.getElementById('page-header');
      this.renderer.setStyle(this.header, 'webkitTransition', 'top 700ms');
      this.renderer.setStyle(this.header, 'webkitTransition', 'top 700ms');
      this.footer = document.getElementById('page-footer');
      this.renderer.setStyle(this.footer, 'webkitTransition', 'bottom 700ms');
    });
  }

  onContentScroll(scrollEvent) {
    /*
    Fired when (ionScroll) event fires on the <ion-content> element.
    Note: This event must be manually enabled on the element as Ionic disbales by default due performance.
    */
    const delta = scrollEvent.detail.deltaY;

    if (scrollEvent.detail.currentY === 0 && this.hidden) {
      this.show();
    } else if (!this.hidden && delta > this.triggerDistance) {
      this.hide();
    } else if (this.hidden && delta < -this.triggerDistance) {
      this.show();
    }
  }

  hide() {
    // Hide the header and footer elements.
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.header, 'top', '-120px');
      this.renderer.setStyle(this.footer, 'bottom', '-50px');
    });

    this.hidden = true;
  }

  show() {
    // Show the header and footer elements.
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.header, 'top', '0px');
      this.renderer.setStyle(this.footer, 'bottom', '0px');
    });

    this.hidden = false;
  }

}
