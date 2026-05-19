import {Component, computed, effect, ElementRef, inject, input, signal, viewChild} from '@angular/core';
import {InuLabel} from 'inugami-ng/components/inu-label';
import {InuButton} from 'inugami-ng/components/inu-button';
import {SVG, SVG_MATH} from 'inugami-ng/services';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {NgTemplateOutlet} from '@angular/common';
import {InuIcon} from 'inugami-icons';

@Component({
             selector   : 'inu-panel',
             standalone : true,
             imports    : [
               InuLabel,
               InuButton,
               NgTemplateOutlet,
               InuIcon
             ],
             providers  : [InuTemplateRegistryService],
             templateUrl: './inu-panel.html',
             styleUrl   : './inu-panel.scss',
           })
export class InuPanel {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  duration    = input<number>(500);
  icon        = input<string | undefined>(undefined);
  title       = input<string | undefined>(undefined);
  titleKey    = input<string | undefined>(undefined);
  styleClass  = input<string | undefined>(undefined);
  collapsible = input<boolean>(true);
  collapsed   = input<boolean>(false);

  //
  registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);
  main                                 = viewChild<ElementRef<HTMLElement>>('main');
  footerTemplate                       = computed(() => this.registry.getTemplate('footer'));
  titleTemplate                        = computed(() => this.registry.getTemplate('title'));
  //
  _styleClass                          = computed<string>(() => [
    'inu-panel',
    this.styleClass() ?? '',
    this._collapsed() ? 'inu-panel-collapsed' : 'inu-panel-expanded'
  ].join(' '));
  _animeInProgress                     = signal<boolean>(false);
  _collapsed                           = signal<boolean>(false);

  constructor() {
    effect(() => {
      this._collapsed.set(this.collapsed());
    });
  }

  //==================================================================================================================
  // ACTIONS
  //==================================================================================================================
  protected toggleCollapse(event: PointerEvent) {
    event.stopPropagation();
    event.preventDefault();
    const node = this.main()?.nativeElement;

    if (!this.collapsible() || this._animeInProgress() || !node) {
      return;
    }
    const currentStyle   = node.getAttribute('style') || '';
    node.style.height    = 'auto';
    const computedHeight = SVG_MATH.size(node).height;
    node.setAttribute('style', currentStyle);

    const wasCollapsed = this._collapsed();
    const startHeight  = wasCollapsed ? 0 : computedHeight;
    const endHeight    = wasCollapsed ? computedHeight : 0;
    const delta        = endHeight - startHeight;

    this._animeInProgress.set(true);
    node.setAttribute('class', `animated`);

    SVG.ANIMATION.animate((progress: number) => {
                            const currentProgressHeight = startHeight + (delta * progress);
                            node.style.height           = `${currentProgressHeight}px`;
                          },
                          {
                            duration: this.duration(),
                            timer   : SVG.ANIMATION.TYPES.easeOutCubic,
                            onDone  : () => {
                              if (wasCollapsed) {
                                node.style.removeProperty('height');
                              } else {
                                node.style.height = '0px';
                              }
                              this._collapsed.set(!this._collapsed());
                              requestAnimationFrame(() => {
                                this._animeInProgress.set(false);
                                node.setAttribute('class', ``);
                              });
                            }
                          });
  }
}
