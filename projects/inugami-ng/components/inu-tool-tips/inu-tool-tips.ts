import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild
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
export class InuToolTips implements AfterViewInit {


  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  icon          = input<string>('info');
  message       = input<string>();
  timeout       = input<number>(1000);
  marginY       = input<number>(-70);
  marginX       = input<number>(15);
  autoClosable  = input<boolean>(true);
  closeDuration = input<number>(3000);

  messageNode = viewChild<ElementRef<HTMLElement>>('messageNode');
  contentNode = viewChild<ElementRef<HTMLElement>>('contentNode');

  display                              = signal<boolean>(false);
  position                             = signal<string>('');
  messageTemplate                      = computed(() => this.registry.getTemplate('message'));
  ctrlPressed                          = signal<boolean>(false);
  mouseOver                            = signal<boolean>(false);
  registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);
  el                                   = inject(ElementRef);

  private closeTimer?: any;

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    effect(() => {
      this.initAria();
    });
  }

  ngAfterViewInit(): void {
    this.initAria();
  }

  private initAria() {
    const messageNode = this.messageNode();
    const message     = this.message();
    if (!messageNode || !message) {
      return;
    }
    messageNode.nativeElement.setAttribute('aria-label', message);
  }

  //====================================================================================================================
  // ACTIONS
  //====================================================================================================================
  protected toggleMessage(state?: boolean) {
    if (state === this.display()) return;

    const value = this.display();
    this.display.set(!value);
    this.position.set(`top:${-500}px; left:${-500}px`);
    setTimeout(() => this.refreshPosition(), 0);
  }


  //====================================================================================================================
  // EVENT
  //====================================================================================================================
  @HostListener('window:scroll')
  onScroll() {
    if (this.display()) {
      this.refreshPosition();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.display()) {
      this.refreshPosition();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey) this.ctrlPressed.set(true);
    if (this.mouseOver()) {
      this.openMessageIfRequired(true);
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (!event.ctrlKey) this.ctrlPressed.set(false);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.mouseOver.set(true);
    this.openMessageIfRequired(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.mouseOver.set(false);
  }

  openMessageIfRequired(state: boolean) {
    if (this.ctrlPressed() && this.mouseOver()) {
      this.toggleMessage(state);

      if (this.display()) {
        if (this.autoClosable()) {
          if (this.autoClosable()) {
            this.clearAutoClose();
            this.closeTimer = setTimeout(() => {
              this.toggleMessage(false);
            }, this.closeDuration());
          }
        }
      }
    }
  }

  refreshPosition() {
    const display = this.display();

    const compoPosition = this.contentNode()?.nativeElement?.getBoundingClientRect();
    const msgPosition   = this.messageNode()?.nativeElement?.getBoundingClientRect();
    if (!display || !compoPosition || !msgPosition) {
      return;
    }

    const scrollTop  = globalThis.scrollY || document.documentElement.scrollTop;
    const scrollLeft = globalThis.scrollX || document.documentElement.scrollLeft;

    let y = compoPosition.top + scrollTop + (this.marginY() + msgPosition.height);
    let x = compoPosition.left + scrollLeft + (this.marginX() + compoPosition.width);

    this.position.set(`top:${y}px; left:${x}px`);
  }

  private clearAutoClose() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }


}
