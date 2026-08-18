import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {InuTemplateRegistryService} from 'inugami-ng/directives'

export type LoadingType = 'default' | 'circle';

@Component({
             selector   : 'inu-loading',
             standalone : true,
             providers: [InuTemplateRegistryService],
             imports    : [
               NgTemplateOutlet
             ],
             templateUrl: './inu-loading.component.html',
             styleUrl   : './inu-loading.component.scss',
           })
export class InuLoading implements AfterViewInit {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  loading                              = input<boolean>(false);
  type                                 = input<LoadingType>('default');
  styleClass                           = signal<string>('');
  offsetY                              = input<number>(0);
  offsetX                              = input<number>(0);
  //
  elementRef                           = inject(ElementRef);
  registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);
  // internal
  content                              = computed(() => this.registry.getTemplate('content'));
  _styleClass                          = computed<string>(() => [
    'inu-loading',
    this.styleClass(),
    this.type()
  ].join(' '));
  initialized                          = signal<boolean>(false);
  parentWidth                          = signal<string>('0px');
  parentHeight                         = signal<string>('0px');
  parentTop                            = signal<string>('0px');
  parentLeft                           = signal<string>('0px');

  constructor() {
    effect(() => {
      const isLoading   = this.loading();
      const currentType = this.type();

      this.resize()
    });
  }

  ngAfterViewInit(): void {
    this.resize();
  }


  private resize() {
    const parent = this.elementRef.nativeElement.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      this.parentWidth.set(`${rect.width}px`);
      this.parentHeight.set(`${rect.height}px`);
      this.parentTop.set(`${rect.top + window.scrollY + this.offsetY()}px`);
      this.parentLeft.set(`${rect.left + window.scrollX + this.offsetX()}px`);
    }

  }

//====================================================================================================================
  // EVENTS
  //====================================================================================================================
  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  @HostListener('window:scroll', ['$event'])
  protected onWindowScroll(event: Event) {
    this.resize();
  }
}
