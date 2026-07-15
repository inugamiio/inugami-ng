import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input, model, ModelSignal,
  output,
  signal, TemplateRef,
  viewChild
} from '@angular/core';
import {SVG, SVG_BUILDER, SVG_MATH, SVG_TRANSFORM} from 'inugami-ng/services'
import {
  BoundedTime,
  BucketTimed,
  BucketTimedLoader,
  ResourceTimedSelected,
  TimeLineRenderer,
  TimeLineRendererBuilder
} from 'inugami-ng/models'
import {InuSvgTimelineHistogram} from './renderer/inu-svg-timeline-histogram'
import {debounceTime, of, Subscription, takeUntil} from 'rxjs'
import {FormField, FormValueControl} from '@angular/forms/signals'
import {InuIcon} from 'inugami-icons'
import {InuLabel} from '../inu-label/inu-label'
import {UuidUtils} from 'inugami-ng/utils'
import {InuTemplateRegistryService} from 'inugami-ng/directives'
import {NgClass, NgTemplateOutlet} from '@angular/common'

const CSS_HIDDEN = 'hidden'

@Component({
             selector   : 'inu-svg-timeline',
             standalone : true,
             imports    : [
               InuIcon,
               InuLabel,
               NgTemplateOutlet
             ],
             providers  : [InuTemplateRegistryService],
             templateUrl: './inu-svg-timeline.html',
             styleUrl   : './inu-svg-timeline.scss',
           })
export class InuSvgTimeline implements FormValueControl<Date[]>, AfterViewInit {


  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  //input
  readonly disabled     = input(false);
  readonly label        = input('');
  readonly labelKey     = input('');
  readonly icon         = input('');
  readonly bottomMargin = input<number>(30);
  readonly from         = input<Date | undefined>(undefined);
  readonly lazy         = input<BucketTimedLoader<number> | undefined>(undefined);
  readonly leftMargin   = input<number>(100);
  readonly padding      = input<number>(0.99);
  readonly renderer     = input<TimeLineRendererBuilder>(() => new InuSvgTimelineHistogram());
  readonly resolution   = input<number>(100);
  readonly rightMargin  = input<number>(20);
  readonly showCursor   = input<boolean>(true);
  readonly styleclass   = input<string>('');
  readonly topMargin    = input<number>(20);
  readonly until        = input<Date | undefined>(undefined);
  readonly zoomRatio    = input<number>(0.1);
  readonly showTooltips = input<boolean>(true);
  readonly _required    = input(false, {alias: 'required'});

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
  focus                      = signal<boolean>(false);

  //output
  hover    = output<ResourceTimedSelected>();
  leave    = output<ResourceTimedSelected>();
  selected = output<BoundedTime>();

  //injection
  private component                                     = viewChild<ElementRef<HTMLElement>>('component');
  private container                                     = viewChild<ElementRef<SVGElement>>('container');
  private readonly DRAG_STEP_PX                         = 10;
  private readonly DEBOUNCE_MS                          = 10;
  private readonly registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);
  tooltipsTemplate                                      = signal<TemplateRef<any> | undefined>(undefined);
  readonly hostElement                                  = inject(ElementRef);
  // internal
  id                                                    = computed<string>(() => UuidUtils.buildUid());
  activeRenderer: TimeLineRenderer | null               = null;
  activeResolution: number                              = 100;
  axis: SVGElement | null                               = null;
  axisX: SVGElement | null                              = null;
  axisXGroup: SVGElement | null                         = null;
  axisY: SVGElement | null                              = null;
  axisYGroup: SVGElement | null                         = null;
  boundOnMouseMove                                      = this.onMouseMove.bind(this);
  canvas: SVGElement | null                             = null;
  selectArea: SVGElement | null                         = null;
  currentFrom                                           = signal<Date | undefined>(undefined);
  currentUntil                                          = signal<Date | undefined>(undefined);
  cursor: SVGElement | null                             = null;
  cursorTime: SVGElement | null                         = null;
  cursorValue: SVGElement | null                        = null;
  data: BucketTimed<number>[]                           = []
  debounceTimer: any                                    = null;
  dragStartFromMs                                       = 0;
  dragStartUntilMs                                      = 0;
  dragStartX                                            = 0;
  graph: SVGElement | null                              = null;
  height: number                                        = 200;
  isDragging                                            = false;
  lastAppliedDeltaX                                     = 0;
  lastMiddleClickTime                                   = 0;
  locator: SVGElement | null                            = null;
  maxValue                                              = 0;
  parent: HTMLElement | null                            = null;
  width: number                                         = 600;
  zoom                                                  = signal<number>(1);
  resizeObserver: ResizeObserver | null                 = null;
  _styleClassLabel                                      = computed<string>(() => {
    return [
      'inu-svg-timeline-label',
      this.disabled() ? 'disabled' : '',
      !this.valid() ? 'invalid' : '',
      this.focus() ? 'focus' : '',
      this.styleclass() ? this.styleclass() : ''
    ].join(' ');
  });
  _styleClass                                           = computed<string>(() => {
    return [
      'inu-svg',
      'inu-svg-timeline',
      this.disabled() ? 'disabled' : '',
      this.styleclass() ? this.styleclass() : ''
    ].join(' ');
  });
  private hoverSubscriber: Subscription | undefined;
  private leaveSubscriber: Subscription | undefined;

  // select state
  startSelected = signal<Date | undefined>(undefined);

  // Tooltip state
  tooltipData = signal<ResourceTimedSelected | undefined>(undefined);
  tooltipX    = signal<number>(0);
  tooltipY    = signal<number>(0);

  tooltipsClass = computed<string>(() => {
    const result = ['inu-svg-timeline-tooltip'];
    if (this.tooltipData()) {
      result.push('display');
    }
    return result.join(' ');
  });
  isInitialized = signal<boolean>(false);
  //====================================================================================================================
  // INIT
  //====================================================================================================================


  constructor() {


    effect(() => {
      const nextRenderer   = this.renderer()();
      const nextResolution = this.resolution();
      const definedValue   = this.value();

      this.initFromSignalForm(definedValue);
      if (!this.graph) {
        return;
      }

      if (this.activeRenderer !== nextRenderer) {
        this.switchRenderer(nextRenderer);
      }

      if (this.activeResolution != nextResolution) {
        this.activeResolution = this.resolution() ?? 100;
        this.data             = [];
        this.loadData(false);
        this.maxValue = this.getMaxValue();
        this.forceUpdateAxis();
        this.subscribeRendererListener()
      }
    });
  }

  private initFromSignalForm(definedValue: Date[]) {
    if (definedValue.length != 2) {
      this.currentFrom.set(this.from());
      this.currentUntil.set(this.until());
      return;
    }


    if (!this.isInitialized()) {
      const from  = definedValue[0] < definedValue[1] ? definedValue[0] : definedValue[1];
      const until = definedValue[1] > definedValue[0] ? definedValue[1] : definedValue[0];
      this.currentFrom.set(from);
      this.currentUntil.set(until);

      this.data = [];
      this.loadData(true);
      this.maxValue = this.getMaxValue();
      this.forceUpdateAxis();
      this.subscribeRendererListener();
      this.isInitialized.set(true);
    }
  }

  ngAfterViewInit(): void {
    const component       = this.component();
    const container       = this.container();
    this.activeRenderer   = this.renderer()();
    this.activeResolution = this.resolution();
    this.subscribeRendererListener();

    if (!this.currentFrom()) {
      this.currentFrom.set(this.from());
    }
    if (!this.currentUntil()) {
      this.currentUntil.set(this.until());
    }


    if (!this.tooltipsTemplate()) {
      this.tooltipsTemplate.set(this.registry.getTemplate('tooltips'));
    }

    if (component && container) {
      this.resizeObserver = new ResizeObserver(() => {
        this.onResize();
      });
      this.resizeObserver.observe(component.nativeElement);

      component.nativeElement.onwheel = (event) => this.onZoom(event);
      this.resolveParentSize(component);
      this.initLayout(component, container);
      this.resize();
      if (this.graph) {
        this.initCurrentRenderer();
        this.forceUpdateAxis();
      }
      this.loadData();

    }
  }

  private switchRenderer(newRenderer: TimeLineRenderer): void {
    const oldRenderer = this.activeRenderer;
    this.unsubscribeRendererListener();
    const destroy$ = oldRenderer ? oldRenderer.destroy() : of(null);

    destroy$.subscribe({
                         next: () => {
                           while (this.graph?.firstChild) {
                             this.graph.removeChild(this.graph.firstChild);
                           }
                           this.activeRenderer = newRenderer;
                           this.initCurrentRenderer();

                           this.loadData(true);
                           this.maxValue = this.getMaxValue();
                           this.forceUpdateAxis();
                           this.subscribeRendererListener()
                         }
                       });
  }

  private initCurrentRenderer(): void {
    if (!this.activeRenderer || !this.graph) return;

    const usableWidth  = Math.max(0, this.width - this.leftMargin() - this.rightMargin());
    const usableHeight = Math.max(0, this.height - this.bottomMargin() - this.topMargin());

    this.activeRenderer.init({
                               graph     : this.graph,
                               height    : usableHeight,
                               width     : usableWidth,
                               resolution: this.activeResolution
                             });
  }

  private updateContextCurrentRenderer(): void {
    if (!this.activeRenderer || !this.graph) return;

    const usableWidth  = Math.max(0, this.width - this.leftMargin() - this.rightMargin());
    const usableHeight = Math.max(0, this.height - this.bottomMargin() - this.topMargin());

    this.activeRenderer.updateContext(usableHeight,
                                      usableWidth,
                                      this.activeResolution
    );
  }

  //==================================================================================================================
  // LOADING
  //=================================================================================================================
  public loadData(animate?: boolean) {
    const from  = this.currentFrom();
    const until = this.currentUntil();
    const lazy  = this.lazy();

    if (this.data.length > 0) {
      this.maxValue = this.getMaxValue();
      this.activeRenderer?.setMaxValue(this.maxValue);
      this.updateData(this.data, animate);
      this.forceUpdateAxis();
      return;
    }

    if (from && until && lazy) {
      lazy(from,
           until,
           this.activeResolution)
        .subscribe({
                     next: res => {
                       this.data     = res;
                       this.maxValue = this.getMaxValue();
                       this.activeRenderer?.setMaxValue(this.maxValue);
                       this.updateData(res, animate);
                       this.forceUpdateAxis();
                     }
                   });
    }
  }

  private updateData(res: BucketTimed<number>[], animate?: boolean) {
    this.updateContextCurrentRenderer();
    this.activeRenderer?.updateValues(res, animate);
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
    const locator   = this.locator;
    const container = this.container()?.nativeElement;
    this.resizeCursor();
    if (this.axis) {
      this.axis.remove();
      this.axis  = null;
      this.axisX = null;
      this.axisY = null;
    }


    if (this.canvas) {
      this.axis = this.renderAxis(this.canvas);
    }
  }

  private resizeCursor() {
    const container = this.container()?.nativeElement;
    if (!this.cursorValue || !container) {
      return;
    }

    const line = SVG_BUILDER.renderLine({
                                          start: {x: this.leftMargin(), y: 0},
                                          end  : {x: this.width + this.rightMargin(), y: 0}
                                        });

    this.cursorValue.setAttribute('d', line);
  }

  private forceUpdateAxis() {
    const yPos = this.height - this.bottomMargin();
    const xPos = this.leftMargin();

    if (this.axisXGroup) {
      while (this.axisXGroup?.firstChild) {
        this.axisXGroup.removeChild(this.axisXGroup.firstChild);
      }
      this.renderSubdivisionsX(this.axisXGroup, yPos);
    }
    if (this.axisYGroup) {
      while (this.axisYGroup?.firstChild) {
        this.axisYGroup.removeChild(this.axisYGroup.firstChild);
      }
      this.renderSubdivisionsY(this.axisYGroup, xPos, yPos, this.height - this.topMargin() - this.bottomMargin());
    }
  }

  private initLayout(component: ElementRef<HTMLElement>, container: ElementRef<SVGElement>) {
    const root      = SVG_BUILDER.createGroup(container.nativeElement, {styleClass: 'root'});
    this.cursor     = SVG_BUILDER.createGroup(root, {styleClass: 'cursor-grp'});
    this.locator    = SVG_BUILDER.createGroup(root, {styleClass: 'locator'});
    this.canvas     = SVG_BUILDER.createGroup(this.locator, {styleClass: 'canvas'});
    this.selectArea = this.buildSelectArea(root);


    if (this.canvas) {
      this.graph = SVG_BUILDER.createGroup(this.canvas, {styleClass: 'graph'});
      this.axis  = this.renderAxis(this.canvas);
      if (this.showCursor()) {
        this.renderCursor(root, this.axisX, this.axisY);
      }
    }

    if (this.graph) {
      SVG.TRANSFORM.translateX(this.graph, this.leftMargin());
      SVG.TRANSFORM.translateY(this.graph, this.height - this.bottomMargin());
    }
  }

  private buildSelectArea(root: SVGElement | null): SVGElement | null {
    const result = SVG_BUILDER.createRect(root, {
      styleClass: 'selector',
      height    : this.height - this.bottomMargin() - this.topMargin()
    });
    SVG_TRANSFORM.translateY(result, this.topMargin());
    SVG_TRANSFORM.addClass(result, CSS_HIDDEN);
    return result;
  }

  private renderCursor(parent: SVGElement | null, axisX: SVGElement | null, axisY: SVGElement | null) {
    if (!parent || !axisX || !axisY) {
      return;
    }

    if (this.cursor) {
      this.cursorValue = SVG_BUILDER.createLine({
                                                  start: {x: this.leftMargin() - 100, y: 0},
                                                  end  : {x: this.width, y: 0}
                                                },
                                                this.cursor,
                                                {styleClass: 'cursor cursor-value'});


      this.cursorTime = SVG_BUILDER.createLine({
                                                 start: {x: 0, y: 0},
                                                 end  : {x: 0, y: this.height - this.bottomMargin()}
                                               },
                                               this.cursor,
                                               {styleClass: 'cursor cursor-time'});
    }

  }

  private renderAxis(parent: SVGElement): SVGElement | null {
    const result = SVG_BUILDER.createGroup(parent, {styleClass: 'axis'});
    this.axisX   = SVG_BUILDER.createGroup(result, {styleClass: 'axisX'});
    const yPos   = this.height - this.bottomMargin();
    const xPos   = this.leftMargin();

    if (this.axisX) {
      SVG_BUILDER.createLine({
                               start: {x: this.leftMargin(), y: this.height - this.bottomMargin()},
                               end  : {x: this.width, y: this.height - this.bottomMargin()}
                             },
                             this.axisX);
      this.axisXGroup = SVG_BUILDER.createGroup(this.axisX, {styleClass: 'axis-x-group'});
      if (this.axisXGroup) {
        this.renderSubdivisionsX(this.axisXGroup, yPos);
      }
    }

    this.axisY = SVG_BUILDER.createGroup(result, {styleClass: 'axisY'});
    if (this.axisY) {

      SVG_BUILDER.createLine({
                               start: {x: this.leftMargin(), y: this.height - this.bottomMargin()},
                               end  : {x: this.leftMargin(), y: this.topMargin()}
                             },
                             this.axisY);
      this.axisYGroup = SVG_BUILDER.createGroup(this.axisX, {styleClass: 'axis-y-group'});
      if (this.axisYGroup) {
        this.renderSubdivisionsY(this.axisYGroup, xPos, yPos, this.height - this.topMargin() - this.bottomMargin());
      }
    }

    return result;
  }

  private renderSubdivisionsX(axisXGroup: SVGElement, yBase: number): void {
    const usableWidth = this.width - this.leftMargin() - this.rightMargin();
    if (usableWidth <= 0) return;

    const res     = Math.max(1, this.activeResolution);
    const fromMs  = this.currentFrom()?.getTime();
    const untilMs = this.currentUntil()?.getTime();

    const maxTicks = Math.min(res, Math.floor(usableWidth / 50));
    const count    = Math.max(2, maxTicks);
    const stepPx   = usableWidth / (count - 1);

    const ticksGroup      = SVG_BUILDER.createGroup(axisXGroup, {styleClass: 'axis-ticks-x'});
    const totalDurationMs = (untilMs ?? 0) - (fromMs ?? 0);
    const intervalMs      = totalDurationMs / (count - 1);

    if (ticksGroup) {
      for (let i = 0; i < count; i++) {
        const x         = this.leftMargin() + i * stepPx;
        const tickGroup = SVG_BUILDER.createGroup(ticksGroup, {styleClass: 'axis-tick-x'});
        if (!tickGroup) {
          continue;
        }
        SVG_TRANSFORM.translateX(tickGroup, x);
        SVG_TRANSFORM.translateY(tickGroup, yBase);

        const tickMajor = i % 10 == 0;
        const tickSize  = tickMajor ? 15 : 7;
        SVG_BUILDER.createLine(
          {
            start: {x: 0, y: 0},
            end  : {x: 0, y: tickSize}
          },
          tickGroup
        );

        if (fromMs !== undefined && untilMs !== undefined) {
          const ratio      = i / (count - 1);
          const timeAtTick = new Date(fromMs + ratio * (untilMs - fromMs));
          const labelText  = tickMajor
            ? this.formatTickLabel(timeAtTick, intervalMs)
            : this.formatTickLabelMinor(timeAtTick, intervalMs);

          const textNode = SVG_BUILDER.createText(labelText, tickGroup, {
            styleClass: 'axis-tick-label' +
                        (tickMajor ? ' major' : ' minor')
          });

          textNode?.setAttribute('text-anchor', 'middle');
          textNode?.setAttribute('font-size', tickMajor ? '12px' : '9px');
          SVG_TRANSFORM.translateY(textNode, tickMajor ? 20 : 15);
        }
      }
    }
  }

  private formatTickLabel(date: Date, intervalMs: number): string {
    const ONE_MINUTE = 60_000;
    const ONE_HOUR   = 3_600_000;
    const ONE_DAY    = 86_400_000;
    const ONE_MONTH  = 30 * ONE_DAY;

    const pad = (n: number) => n.toString().padStart(2, '0');

    const year  = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day   = pad(date.getDate());
    const hours = pad(date.getHours());
    const mins  = pad(date.getMinutes());
    const secs  = pad(date.getSeconds());

    if (intervalMs >= ONE_MONTH) {
      return `${year}.${month}`;
    }
    if (intervalMs >= ONE_DAY) {
      return `${year}.${month}.${day}`;
    }
    if (intervalMs >= ONE_HOUR) {
      return `${month}.${day} ${hours}:${mins}`;
    }
    if (intervalMs >= ONE_MINUTE) {
      return `${hours}:${mins}`;
    }
    return `${hours}:${mins}:${secs}`;
  }


  private formatTickLabelMinor(date: Date, intervalMs: number): string {
    const ONE_MINUTE = 60_000;
    const ONE_HOUR   = 3_600_000;
    const ONE_DAY    = 86_400_000;
    const ONE_MONTH  = 30 * ONE_DAY;
    const ONE_YEAR   = 365 * ONE_MONTH;

    const pad = (n: number) => n.toString().padStart(2, '0');

    const year  = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day   = pad(date.getDate());
    const hours = pad(date.getHours());
    const mins  = pad(date.getMinutes());
    const secs  = pad(date.getSeconds());


    if (intervalMs >= ONE_YEAR) {
      return `${year}`;
    }
    if (intervalMs >= (ONE_YEAR / 2)) {
      return `${year}.${month}`;
    }
    if (intervalMs >= ONE_MONTH) {
      return `${month}`;
    }

    if (intervalMs >= ONE_MONTH) {
      return `${month}`;
    }
    if (intervalMs >= ONE_DAY) {
      return `${month}.${day}`;
    }
    if (intervalMs >= ONE_HOUR) {
      return `${month}.${day} ${hours}:${mins}`;
    }
    if (intervalMs >= ONE_MINUTE) {
      return `${hours}:${mins}`;
    }
    return `${hours}:${mins}:${secs}`;
  }


  private renderSubdivisionsY(axisYGroup: SVGElement, xBase: number, yBase: number, maxHeight: number): void {
    const usableHeight = this.height - this.topMargin() - this.bottomMargin();
    if (usableHeight <= 0) return;

    const minPixelsPerTick = 45;
    const maxPossibleTicks = Math.floor(usableHeight / minPixelsPerTick);
    const count            = Math.max(2, Math.min(10, maxPossibleTicks));
    const stepPx           = usableHeight / (count - 1);
    const ticksGroup       = SVG_BUILDER.createGroup(axisYGroup, {styleClass: 'axis-ticks-y'});

    if (ticksGroup) {
      for (let i = 0; i < count; i++) {
        const y         = yBase - (i * stepPx);
        const tickGroup = SVG_BUILDER.createGroup(ticksGroup, {styleClass: 'axis-tick-y'});
        if (!tickGroup) continue;

        SVG_TRANSFORM.translateX(tickGroup, xBase);
        SVG_TRANSFORM.translateY(tickGroup, y);

        const tickMajor = i % 2 === 0 || i === count - 1;
        const tickSize  = tickMajor ? 8 : 4;

        SVG_BUILDER.createLine(
          {start: {x: 0, y: 0}, end: {x: -tickSize, y: 0}},
          tickGroup
        );


        const ratio        = i / (count - 1);
        const currentValue = this.maxValue * ratio;
        const labelText    = this.formatYTickLabel(currentValue, this.maxValue);

        const textNode = SVG_BUILDER.createText(labelText, tickGroup, {
          styleClass: 'axis-tick-label-y'
        });

        textNode?.setAttribute('text-anchor', 'end');
        textNode?.setAttribute('dominant-baseline', 'central');
        textNode?.setAttribute('font-size', '10px');
        SVG_TRANSFORM.translateX(textNode, -tickSize - 6);
      }
    }
  }

  private getMaxValue(): number {
    const res              = this.activeResolution;
    const values: number[] = new Array(res).fill(0);

    const cumulative = this.activeRenderer?.isCumulative() ?? false;
    for (const bucket of this.data) {
      for (const resource of bucket.resources) {
        for (let i = 0; i < Math.min(resource.values.length, res); i++) {
          const point = resource.values[i];

          if (cumulative) {
            values[i] += point.value;
          } else {
            if (point.value > values[i]) {
              values[i] = point.value;
            }
          }
        }
      }
    }

    const max = Math.max(...values);
    return (max > 0 ? max : 100) * 1.30;
  }

  private formatYTickLabel(value: number, maxValue: number): string {
    if (maxValue >= 1_000_000_000_000) {
      return `${(value / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (maxValue >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}G`;
    }
    if (maxValue >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }
    if (maxValue >= 1_000) {
      return `${(value / 1_000).toFixed(2)}k`;
    }
    return value.toFixed(2);
  }

  //====================================================================================================================
  // ON RESIZE
  //====================================================================================================================
  onResize() {
    const component = this.component();
    if (!component) return;
    this.resolveParentSize(component);
    this.resize();

    const usableWidth = this.width - this.leftMargin() - this.rightMargin();
    this.activeRenderer?.updateContext(this.height, usableWidth, this.activeResolution);
    this.data = [];
    this.loadData(false);
    this.forceUpdateAxis();
  }

  //====================================================================================================================
  // ON ZOOM
  //====================================================================================================================
  private onZoom(event: WheelEvent) {
    event.stopPropagation();
    event.preventDefault();

    const usableWidth = this.width - this.leftMargin() - this.rightMargin();
    if (usableWidth <= 0) return;

    const componentEl = this.component()?.nativeElement;
    if (!componentEl) return;

    const componentRect = componentEl.getBoundingClientRect();
    const mouseX        = event.clientX - componentRect.left - this.leftMargin();

    const cursorRatio     = Math.max(0, Math.min(1, mouseX / usableWidth));
    const currentFromMs   = this.currentFrom()?.getTime() ?? Date.now();
    const currentUntilMs  = this.currentUntil()?.getTime() ?? Date.now();
    const currentDuration = currentUntilMs - currentFromMs;

    const pivotMs = currentFromMs + (currentDuration * cursorRatio);
    const scale   = event.deltaY > 0 ? (1 + this.zoomRatio()) : 1 / (1 + this.zoomRatio());

    const newDuration = currentDuration * scale;
    const newFromMs   = pivotMs - (newDuration * cursorRatio);
    const newUntilMs  = pivotMs + (newDuration * (1 - cursorRatio));

    const newFrom  = new Date(newFromMs);
    const newUntil = new Date(newUntilMs);
    this.currentFrom.set(newFrom);
    this.currentUntil.set(newUntil);
    if (!this.disabled) {
      this.value.set([newFrom, newUntil]);
    }
    this.forceUpdateAxis();
    this.data = [];
    this.loadData(false);
  }

  //====================================================================================================================
  // ON DRAG
  //====================================================================================================================
  protected onMouseDown(event: MouseEvent): void {
    const button = event.button as number;
    if (button === 1) {
      event.preventDefault();

      const now = Date.now();
      if (now - this.lastMiddleClickTime < 400) {
        this.resetToInitialState(event.ctrlKey);
      }
      this.lastMiddleClickTime = now;
      return;
    }

    if (button !== 0) return;

    this.isDragging       = true;
    this.dragStartX       = event.clientX;
    this.dragStartFromMs  = this.currentFrom()?.getTime() ?? 0;
    this.dragStartUntilMs = this.currentUntil()?.getTime() ?? 0;
    // PAN MODE
    if (event.ctrlKey) {
      document.body.style.cursor = 'grabbing';
      const axisXElement         = this.axisX as SVGGraphicsElement | undefined;
      if (!axisXElement) return;
      window.addEventListener('mousemove', this.boundOnMouseMove);
    }
    // SELECT MODE
    else {
      document.body.style.cursor = 'grabbing';
      SVG_TRANSFORM.removeClass(this.selectArea, CSS_HIDDEN);
      this.startSelected.set(this.getTimeAtMouseEvent(event));


      if (this.selectArea) {
        const containerEl = this.container()?.nativeElement;
        if (containerEl) {
          const rect   = containerEl.getBoundingClientRect();
          const startX = event.clientX - rect.left;

          this.selectArea.setAttribute('x', String(startX));
          this.selectArea.setAttribute('width', '0');
        }
      }
    }
  }


  private resetToInitialState(ctrl: boolean): void {
    const initialFrom  = this.from() ?? new Date(new Date().getTime() - (60_000 * 720));
    const initialUntil = this.until() ?? new Date();

    this.currentFrom.set(initialFrom);
    this.currentUntil.set(initialUntil);

    this.data = [];
    this.forceUpdateAxis();
    this.loadData(false);
  }

  protected onMouseUp(event: MouseEvent): void {
    if (this.isDragging) {
      this.isDragging            = false;
      document.body.style.cursor = 'default';

      if (!event.ctrlKey) {
        SVG_TRANSFORM.addClass(this.selectArea, CSS_HIDDEN);
        let rawFrom  = this.startSelected();
        let rawUntil = this.getTimeAtMouseEvent(event);

        if (rawFrom && rawUntil && rawFrom > rawUntil) {
          const temp = rawFrom;
          rawFrom    = rawUntil;
          rawUntil   = temp;
        }
        // ---------------------------------
        let currentFrom  = rawFrom ?? this.from() ?? new Date(new Date().getTime() - (60000 * 12));
        let currentUntil = rawUntil ?? this.until() ?? new Date();
        // -------------------------------------------

        this.currentFrom.set(currentFrom);
        this.currentUntil.set(currentUntil);
        this.forceUpdateAxis();
        this.data = [];
        this.loadData(false);

        // send events
        if (this.disabled()) {
          return;
        }
        this.selected.emit({
                             from : currentFrom,
                             until: currentUntil
                           });
        this.value.set([currentFrom, currentUntil]);
        this.changed.emit([currentFrom, currentUntil]);
      }
    }
  }

  protected onMouseMove(event: MouseEvent): void {
    SVG_TRANSFORM.addClass(this.cursor, 'display');
    this.updateCursorPositions(event);
    if (!this.isDragging || !this.axisX) return;

    const currentDeltaX = event.clientX - this.dragStartX;


    if (Math.abs(currentDeltaX - this.lastAppliedDeltaX) < this.DRAG_STEP_PX) {
      return;
    }

    this.lastAppliedDeltaX = currentDeltaX;
    const axisWidth        = this.axisX.getBoundingClientRect().width;
    if (axisWidth <= 0) return;


    const durationMs = this.dragStartUntilMs - this.dragStartFromMs;
    const msPerPixel = durationMs / axisWidth;
    const deltaMs    = currentDeltaX * msPerPixel;
    const newFromMs  = this.dragStartFromMs - deltaMs;
    const newUntilMs = this.dragStartUntilMs - deltaMs;

    if (!event.ctrlKey && this.selectArea) {
      const containerEl = this.container()?.nativeElement;
      if (containerEl) {
        const rect     = containerEl.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const startX   = Number(this.selectArea.getAttribute('x') || currentX);
        const initialX = this.dragStartX - rect.left;

        const x     = Math.min(initialX, currentX);
        const width = Math.abs(currentX - initialX);

        this.selectArea.setAttribute('x', String(x));
        this.selectArea.setAttribute('width', String(width));
      }
      return;
    }
    // PAN MODE
    else {
      this.currentFrom.set(new Date(newFromMs));
      this.currentUntil.set(new Date(newUntilMs));


      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.data = [];
      this.forceUpdateAxis();
      this.debounceTimer = setTimeout(() => {
        this.loadData(false);
      }, this.DEBOUNCE_MS);
    }
  }

  onMouseLeave() {
    SVG_TRANSFORM.removeClass(this.cursor, 'display');
  }


  updateCursorPositions(event: MouseEvent) {
    const containerEl = this.container()?.nativeElement;
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    if (this.cursorTime) {
      SVG_TRANSFORM.translateX(this.cursorTime, mouseX);
    }
    if (this.cursorValue) {
      SVG_TRANSFORM.translateY(this.cursorValue, mouseY);
    }
  }


  //====================================================================================================================
  // RENDERER LISTENER
  //====================================================================================================================
  private subscribeRendererListener() {
    const leave$ = this.activeRenderer?.leave() || of();

    this.hoverSubscriber = this.activeRenderer?.hover()
      .subscribe({
                   next: v => {
                     if (this.showTooltips()) {
                       this.tooltipData.set(v);
                       this.tooltipX.set((v?.event?.clientX ?? 0) + window.scrollX - 15);
                       this.tooltipY.set((v?.event?.clientY ?? 0) + window.scrollY - 15);
                     }
                     this.hover.emit(v)
                   }
                 });
    this.leaveSubscriber = leave$.subscribe({
                                              next: v => {
                                                if (this.showTooltips()) {
                                                  this.tooltipData.set(undefined);
                                                }
                                                this.leave.emit(v);
                                              }
                                            });
  }

  private unsubscribeRendererListener() {
    this.hoverSubscriber?.unsubscribe();
    this.leaveSubscriber?.unsubscribe();
  }

  private getTimeAtMouseEvent(event: MouseEvent): Date | undefined {
    const axisXElement = this.axisX as SVGGraphicsElement | undefined;
    if (!axisXElement) return undefined;

    const axisRect = axisXElement.getBoundingClientRect();
    if (axisRect.width <= 0) return undefined;

    const mouseX      = event.clientX - axisRect.left;
    const cursorRatio = Math.max(0, Math.min(1, mouseX / axisRect.width));

    const fromMs  = this.currentFrom()?.getTime();
    const untilMs = this.currentUntil()?.getTime();

    if (fromMs === undefined || untilMs === undefined) return undefined;

    const durationMs = untilMs - fromMs;
    const timeMs     = fromMs + (durationMs * cursorRatio);

    return new Date(timeMs);
  }


}
