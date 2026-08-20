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
  BucketTimedLoader, ResourceTimedSelected,
  TimeLineRenderer,
  TimeLineRendererBuilder, ValueRenderer, ValueRendererAggregator,
  ValueRendererBuilder
} from 'inugami-ng/models'
import {InuIcon} from 'inugami-icons'
import {InuLabel} from '../inu-label/inu-label'
import {InuTemplateRegistryService} from 'inugami-ng/directives'
import {InuFormsUtils, ObservableSubscriber, UuidUtils} from 'inugami-ng/utils'
import {FormField, FormValueControl} from '@angular/forms/signals'
import {InuSvgTimelineHistogram} from '../inu-svg-timeline/renderer/inu-svg-timeline-histogram'
import {InuSvgValueSimple} from './renderer/inu-svg-value-simple'
import {Observable, of} from 'rxjs'
import {InuSvgValueAggregator} from './renderer/inu-svg-value-aggregator'


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
  readonly lazy         = input<BucketTimedLoader<number> | undefined>(undefined);
  readonly renderer     = input<ValueRendererBuilder>(() => new InuSvgValueSimple());
  readonly aggregator   = input<ValueRendererAggregator>(InuSvgValueAggregator.sum);
  readonly resolution   = input<number>(10);
  readonly styleclass   = input<string>('');
  readonly from         = input<Date | undefined>(undefined);
  readonly until        = input<Date | undefined>(undefined);
  readonly showTooltips = input<boolean>(true);
  readonly _required    = input(false, {alias: 'required'});

  // margin
  readonly bottomMargin = input<number>(10);
  readonly leftMargin   = input<number>(10);
  readonly rightMargin  = input<number>(10);
  readonly topMargin    = input<number>(10);

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
  initializing                         = signal<boolean>(true);
  focus                                = signal<boolean>(false);
  data                                 = signal<BucketTimed<number>[]>([]);
  currentFrom                          = signal<Date>(new Date(new Date().getTime() - (1440 * 60000)));
  currentUntil                         = signal<Date>(new Date());
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
    InuFormsUtils.onChanged(this.data).subscribe(value => {
      this.updateData(value, true);
    });
    effect(() => {

    });
  }

  ngAfterViewInit(): void {
    const from  = this.from();
    const until = this.until();
    if (from) {
      this.currentFrom.set(from);
    }
    if (until) {
      this.currentUntil.set(until);
    }

    const component     = this.component();
    const container     = this.container();
    this.activeRenderer = this.renderer()();
    this.resolveParentSize(component);
    this.initLayout(component, container);

    if (this.graph) {
      this.initCurrentRenderer();
    }
    this.loadData(true).subscribe().add(() => this.initializing.set(false));
  }

  //====================================================================================================================
  // RENDERER MANAGEMENT
  //====================================================================================================================
  private switchRenderer(newRenderer: TimeLineRenderer): void {

  }

  private initCurrentRenderer(): void {
    if (!this.activeRenderer || !this.graph) return;

    const usableWidth  = Math.max(0, this.width - this.leftMargin() - this.rightMargin());
    const usableHeight = Math.max(0, this.height - this.bottomMargin() - this.topMargin());

    this.activeRenderer.init({
                               graph     : this.graph,
                               height    : usableHeight,
                               width     : usableWidth,
                               resolution: this.resolution()
                             });
  }

  private updateContextCurrentRenderer(): void {
    if (!this.activeRenderer || !this.graph) return;

    const usableWidth  = Math.max(0, this.width - this.leftMargin() - this.rightMargin());
    const usableHeight = Math.max(0, this.height - this.bottomMargin() - this.topMargin());

    this.activeRenderer.updateContext(usableHeight,
                                      usableWidth,
                                      this.resolution()
    );
  }

  //==================================================================================================================
  // LOADING
  //=================================================================================================================
  public loadData(animate?: boolean): Observable<any> {
    const lazy: BucketTimedLoader<number> | undefined = this.lazy();
    if (!lazy) {
      return of();
    }

    const result = new ObservableSubscriber<BucketTimed<number>[]>();
    lazy(this.currentFrom(),
         this.currentUntil(),
         this.resolution())
      .subscribe({
                   next: res => {
                     this.data.set(res);
                   }
                 })
      .add(() => result.next([]));
    return result.observable();
  }

  private updateData(res: BucketTimed<number>[], animate?: boolean) {
    this.updateContextCurrentRenderer();
    const data = this.aggregator()(res);
    this.activeRenderer?.updateValues(data, animate);
  }


  //==================================================================================================================
  // RENDERING
  //=================================================================================================================
  private resolveParentSize(component?: ElementRef<HTMLElement>) {
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


  private initLayout(component?: ElementRef<HTMLElement>, container?: ElementRef<SVGElement>) {
    if (!component || !container || !container.nativeElement) {
      return;
    }
    const root   = SVG_BUILDER.createGroup(container?.nativeElement, {styleClass: 'root'});
    this.locator = SVG_BUILDER.createGroup(root, {styleClass: 'locator'});
    this.graph   = SVG_BUILDER.createGroup(this.locator, {styleClass: 'graph'});
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
