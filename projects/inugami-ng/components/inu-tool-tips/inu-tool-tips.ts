import {
  Component,
  computed, effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  signal, viewChild,
  WritableSignal
} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {NgClass, NgTemplateOutlet} from '@angular/common';

@Component({
             selector   : 'inu-tool-tips',
             standalone : true,
             providers  : [InuTemplateRegistryService],
             imports    : [InuIcon, NgTemplateOutlet, NgClass],
             templateUrl: './inu-tool-tips.html',
             styleUrl   : './inu-tool-tips.scss',
           })
export class InuToolTips {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  icon          = input<string>('info');
  message       = input<string>();
  timeout       = input<number>(1000);
  margin        = input<number>(5);
  autoClosable  = input<boolean>(true);
  closeDuration = input<number>(3000);

  messageNode = viewChild<ElementRef<HTMLElement>>('messageNode');
  contentNode = viewChild<ElementRef<HTMLElement>>('contentNode');

  display                              = signal<boolean>(false);
  onComponent                          = signal<boolean>(false);
  position                             = signal<string>('');
  componentPosition                    = computed<DOMRect | undefined>(() => this.contentNode()?.nativeElement?.getBoundingClientRect());
  messagePosition                      = computed<DOMRect | undefined>(() => this.messageNode()?.nativeElement?.getBoundingClientRect());
  messageTemplate                      = computed(() => this.registry.getTemplate('message'));
  ctrlPressed                          = signal<boolean>(false);
  mouseOver                            = signal<boolean>(false);
  registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);
  el                                   = inject(ElementRef);

  private closeTimer?: any;
  //====================================================================================================================
  // EVENT
  //====================================================================================================================
  protected toggleMessage() {
    const nextState =  !this.display();
    if (nextState === this.display()) return;
    const value = this.display();
    this.display.set(!value);
    this.position.set(`top:${-500}px; left:${-500}px`);
    setTimeout(() => this.refreshPosition(), 0);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey) this.ctrlPressed.set(true);
    this.openMessageIfRequired();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (!event.ctrlKey) this.ctrlPressed.set(false);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.mouseOver.set(true);
    this.openMessageIfRequired();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.mouseOver.set(false);
  }

  openMessageIfRequired(){
    if (this.ctrlPressed() && this.mouseOver()) {
      this.toggleMessage();
      if (this.display()) {
        if (this.autoClosable()) {
          if (this.autoClosable()) {
            this.clearAutoClose();
            this.closeTimer = setTimeout(() => {
              this.toggleMessage();
            }, this.closeDuration());
          }
        }
      }
    }
  }

  refreshPosition() {
    const display       = this.display();
    const compoPosition = this.componentPosition();
    const msgPosition   = this.messagePosition();
    if (!display || !compoPosition || !msgPosition) {
      return;
    }


    let y = compoPosition.y - (this.margin() + msgPosition.height);
    let x = compoPosition.x + (compoPosition.width);
    this.position.set(`top:${y}px; left:${x}px`);
  }

  private clearAutoClose() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }
}
