import {AfterViewInit, Component, computed, effect, ElementRef, HostListener, input, viewChild} from '@angular/core';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {SVG, SVG_BUILDER, SVG_MATH, SVG_TRANSFORM} from 'inugami-ng/services';
import {RectOption} from 'inugami-ng/models';

@Component({
  selector: 'inu-svg-isometric',
  standalone: true,
  providers: [InuTemplateRegistryService],
  imports: [],
  template: `
    <div [class]="_styleClass()" #component>
      <svg #container xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
  `,
  styleUrl: './inu-svg-isometric.scss',
})
export class InuSvgIsometric implements AfterViewInit {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  isometric = input<boolean>(true);
  disabled = input<boolean>(false);
  styleclass = input<string>('');
  //
  private component = viewChild<ElementRef<HTMLElement>>('component');
  private container = viewChild<ElementRef<HTMLElement>>('container');
  _styleClass = computed<string>(() => {
    return [
      'inu-svg',
      'inu-svg-isometric',
      this.disabled() ? 'disabled' : '',
      this.styleclass() ? this.styleclass() : ''
    ].join(' ');
  })
  //---
  defaultZoom: number = 50;
  zoom: number = 50;
  //--- SVG components
  height: number = 400;
  width: number = 600;
  parent: HTMLElement | null = null;
  locator: SVGElement | null = null;
  defs: SVGElement | null = null;
  canvas: SVGElement | null = null;
  graph: SVGElement | null = null;
  gridPattern: SVGElement | null = null;
  patternGroup: SVGElement | null = null;
  gridPatternRect: SVGElement | null = null;
  //====================================================================================================================
  // INIT
  //====================================================================================================================



  constructor() {
    effect(() => {
    });
  }

  ngAfterViewInit(): void {
    const component = this.component();
    const container = this.container();
    if (component && container) {
      this.resolveParentSize(component, container);
      this.initializeLayout(container);
      this.updateAfterZoom();
      this.resize();
    }
  }

  @HostListener('window:resize')
  onResize() {
    const component = this.component();
    const container = this.container();
    if (component && container) {
      this.resolveParentSize(component, container);
      this.resize();
    }
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    let step = 1;
    if (event.ctrlKey) {
      step = 10;
    }
    if (event.shiftKey) {
      step = 0.1;
    }
    if (event.deltaY > 0) {
      this.zoom = this.zoom - step;
    } else {
      this.zoom = this.zoom + step;
    }
    if (this.zoom <= 0) {
      this.zoom = 0.001;
    }
    this.updateAfterZoom();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 1) {
      event.preventDefault();
      const startZoom = this.zoom;
      const endZoom = this.defaultZoom;
      const delta = endZoom - startZoom;

      SVG.ANIMATION.animate((progress: number) => {
        const newZoom = startZoom + (delta * progress);
        this.zoom = Math.max(0.001, newZoom);

        this.updateAfterZoom();
      }, {
        duration: 2000,
        timer: SVG.ANIMATION.TYPES.easeOutCubic,
        onDone: () => {
          this.zoom = this.defaultZoom;
          this.updateAfterZoom();
        }
      });
    }
  }

  //====================================================================================================================
  // RENDERING
  //====================================================================================================================
  private resolveParentSize(component: ElementRef<HTMLElement>, container: ElementRef<HTMLElement>) {
    if (component?.nativeElement && component?.nativeElement.parentNode && component?.nativeElement.parentNode.parentNode) {
      this.parent = component?.nativeElement.parentNode.parentNode as HTMLElement;
    }

    if (this.parent) {
      let parentSize = SVG_MATH.size(this.parent);
      this.height = parentSize.height;
      this.width = parentSize.width;
    }

    container?.nativeElement.setAttribute('style', `display: block; height:${this.height}px;width:${this.width}px`);
  }

  private initializeLayout(container: ElementRef<HTMLElement>) {
    this.defs = SVG_BUILDER.createDefs(container?.nativeElement);
    this.locator = SVG_BUILDER.createGroup(container?.nativeElement, {styleClass: 'locator'});
    this.canvas = SVG_BUILDER.createGroup(this.locator, {styleClass: 'canvas'});

    if (this.defs) {
      this.createGridDefs(this.defs);
    }

    if (this.canvas) {
      this.graph = SVG_BUILDER.createGroup(this.canvas, {styleClass: 'graph'});
    }

    if (this.graph) {

      this.renderGrid(this.graph);

    }

    this.updateValues();
  }


  //--------------------------------------------------------------------------------------------------------------------
  // GRID
  //--------------------------------------------------------------------------------------------------------------------
  private createGridDefs(defs: SVGElement) {
    this.gridPattern = SVG_BUILDER.createDefsPattern(defs,
      'gridBackground',
      {
        x: 0,
        y: 0,
        height: SVG_MATH.zoom(1, this.zoom),
        width: SVG_MATH.zoom(1, this.zoom),
        patternUnits: "userSpaceOnUse"
      });

    this.patternGroup = SVG_BUILDER.createGroup(this.gridPattern, {styleClass: 'inu-svg-isometric-grid-background'});
    if (this.patternGroup) {
      const isometric = this.isometric();
      if (isometric) {

        SVG_BUILDER.createCurve(this.patternGroup, 'M 0,14.4337 L 25,0 L 50,14.4337 L 25,28.8675 Z');
      } else {
        this.gridPatternRect = SVG_BUILDER.createRect(this.patternGroup, {
          height: SVG_MATH.zoom(1, this.zoom),
          width: SVG_MATH.zoom(1, this.zoom)
        });
      }

    }

  }

  private renderGrid(graph: SVGElement) {
    const gridGroup = SVG_BUILDER.createGroup(graph, {styleClass: 'inu-svg-isometric-grid'});
    if (gridGroup) {
      this.renderBackground(gridGroup);
    }
  }

  private renderBackground(graph: SVGElement): SVGElement | null {
    const result = SVG_BUILDER.createRect(graph, {
      height: this.height,
      width: this.width,
      styleClass: 'inu-svg-isometric-border'
    });
    if (result) {
      result.setAttribute('fill', 'url(#gridBackground)');
    }
    return result;
  }


  //====================================================================================================================
  // UPDATE VALUES
  //====================================================================================================================
  public updateValues() {

  }

  updateAfterZoom() {

    const width = SVG_MATH.zoom(1, this.zoom);
    const height = this.isometric()? width/Math.sqrt(3) : width;

    if (this.patternGroup) {
      SVG_TRANSFORM.scale(this.patternGroup, width / this.defaultZoom, width / this.defaultZoom);
      if(this.gridPattern){
        this.gridPattern.setAttribute('height',`${height}`);
        this.gridPattern.setAttribute('width',`${width}`);
      }
    }
  }

  //====================================================================================================================
  // TOOLS
  //====================================================================================================================
  public resize(): void {
    if (this.locator && this.parent) {
      SVG_TRANSFORM.center(this.locator, this.parent, true, true);
    }
  }


}
