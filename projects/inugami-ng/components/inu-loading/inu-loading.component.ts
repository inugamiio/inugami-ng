import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  signal
} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {NgClass, NgTemplateOutlet} from '@angular/common';

export type LoadingType = 'default' | 'circle';

@Component({
             selector   : 'inu-loading',
             standalone : true,
             imports    : [
               NgTemplateOutlet
             ],
             templateUrl: './inu-loading.component.html',
             styleUrl   : './inu-loading.component.scss',
           })
export class InuLoading {
  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  loading    = input<boolean>(false);
  type       = input<LoadingType>('default');
  styleClass = signal<string>('');
  elementRef = inject(ElementRef);

  // internal
  _styleClass  = computed<string>(() => [
    'inu-loading',
    this.styleClass(),
    this.type()
  ].join(' '));
  parentWidth  = signal<string>('0px');
  parentHeight = signal<string>('0px');
  parentTop    = signal<string>('0px');
  parentLeft   = signal<string>('0px');

  constructor() {
    effect(() => {
      const isLoading = this.loading();
      const currentType = this.type();

      const parent = this.elementRef.nativeElement.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        this.parentWidth.set(`${rect.width}px`);
        this.parentHeight.set(`${rect.height}px`);
        this.parentTop.set(`${rect.top + window.scrollY}px`);
        this.parentLeft.set(`${rect.left + window.scrollX}px`);
      }
    });
  }
}
