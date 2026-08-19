import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  ModelSignal,
  output,
  signal,
  viewChild
} from '@angular/core';
import {SVG_BUILDER, SVG_MATH} from 'inugami-ng/services'
import {
  BucketTimed,
  BucketTimedLoader,
  TimeLineRenderer,
  TimeLineRendererBuilder, ValueRenderer,
  ValueRendererBuilder
} from 'inugami-ng/models'
import {InuIcon} from 'inugami-icons'
import {InuLabel} from '../inu-label/inu-label'
import {InuTemplateRegistryService} from 'inugami-ng/directives'
import {UuidUtils} from 'inugami-ng/utils'
import {FormField, FormValueControl} from '@angular/forms/signals'
import {InuSvgTimelineHistogram} from '../inu-svg-timeline/renderer/inu-svg-timeline-histogram'
import {InuSvgValueSimple} from './renderer/inu-svg-value-simple'


@Component({
             selector   : 'inu-svg-value',
             standalone : true,
             imports    : [
               InuIcon,
               InuLabel
             ],
             providers  : [InuTemplateRegistryService],
             templateUrl: './inu-svg-value.html',
             styleUrl   : './inu-svg-value.scss',
           })
export class InuSvgValue implements FormValueControl<any>, AfterViewInit {


  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  // input
  readonly disabled     = input(false);
  readonly label        = input('');
  readonly labelKey     = input('');
  readonly icon         = input('');
  readonly bottomMargin = input<number>(30);
  readonly lazy         = input<BucketTimedLoader<number> | undefined>(undefined);
  readonly renderer     = input<ValueRendererBuilder>(() => new InuSvgValueSimple());
  readonly resolution   = input<number>(100);
  readonly styleclass   = input<string>('');
  readonly topMargin    = input<number>(20);
  readonly from         = input<Date | undefined>(undefined);
  readonly until        = input<Date | undefined>(undefined);
  readonly showTooltips = input<boolean>(true);
  readonly _required    = input(false, {alias: 'required'});

  // injection
  private component = viewChild<ElementRef<HTMLElement>>('component');
  private container = viewChild<ElementRef<SVGElement>>('container');

  //FormValueControl
  _formField                 = inject(FormField, {optional: true});
  value: ModelSignal<Date[]> = model(<Date[]>[]);
  changed                    = output<Date[]>();
  valid                      = computed(() => {
    const state = this._formField?.state()
    if (!state) return true;
    const isInvalid      = state.invalid();
    const hasBeenTouched = state.touched();
    return !(isInvalid && hasBeenTouched);
  });

  // internal
  activeRenderer: ValueRenderer | null = null;
  id                                   = computed<string>(() => UuidUtils.buildUid());
  focus                                = signal<boolean>(false);
  parent: HTMLElement | null           = null;
  locator: SVGElement | null           = null;
  graph: SVGElement | null             = null;
  canvas: SVGElement | null            = null;
  width: number                        = 600;
  height: number                       = 200;
  _styleClassLabel                     = computed<string>(() => {
    return [
      'inu-svg-value-label',
      this.disabled() ? 'disabled' : '',
      !this.valid() ? 'invalid' : '',
      this.focus() ? 'focus' : '',
      this.styleclass() ? this.styleclass() : ''
    ].join(' ');
  });
  _styleClass                          = computed<string>(() => {
    return [
      'inu-svg',
      'inu-svg-value',
      this.disabled() ? 'disabled' : '',
      this.styleclass() ? this.styleclass() : ''
    ].join(' ');
  });
  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    effect(() => {

    });
  }

  ngAfterViewInit(): void {
    const component     = this.component();
    const container     = this.container();
    this.activeRenderer = this.renderer()();
  }

  //====================================================================================================================
  // RENDERER MANAGEMENT
  //====================================================================================================================
  private switchRenderer(newRenderer: TimeLineRenderer): void {

  }

  private initCurrentRenderer(): void {

  }

  private updateContextCurrentRenderer(): void {

  }

  //==================================================================================================================
  // LOADING
  //=================================================================================================================
  public loadData(animate?: boolean) {

  }

  private updateData(res: BucketTimed<number>[], animate?: boolean) {

  }

  //==================================================================================================================
  // RENDERING
  //=================================================================================================================
  private resolveParentSize(component: ElementRef<HTMLElement>) {
    if (component?.nativeElement &&
        component?.nativeElement.parentNode &&
        component?.nativeElement.parentNode.parentNode) {
      this.parent = component?.nativeElement.parentNode.parentNode as HTMLElement;
    }

    if (this.parent) {
      let parentSize = SVG_MATH.size(this.parent);
      this.height    = parentSize.height;
      this.width     = parentSize.width;
    }

    this.container()?.nativeElement.setAttribute('style', `display: block; height:${this.height}px;width:${this.width}px`);
  }

  public resize(): void {

  }


  private initLayout(component: ElementRef<HTMLElement>, container: ElementRef<SVGElement>) {
    const root   = SVG_BUILDER.createGroup(container.nativeElement, {styleClass: 'root'});
    this.locator = SVG_BUILDER.createGroup(root, {styleClass: 'locator'});
    this.canvas  = SVG_BUILDER.createGroup(this.locator, {styleClass: 'canvas'});
    this.graph   = SVG_BUILDER.createGroup(this.canvas, {styleClass: 'graph'});
  }


  //====================================================================================================================
  // ON RESIZE
  //====================================================================================================================
  onResize() {

  }


  //====================================================================================================================
  // RENDERER LISTENER
  //====================================================================================================================
  private subscribeRendererListener() {

  }

  private unsubscribeRendererListener() {

  }

}
