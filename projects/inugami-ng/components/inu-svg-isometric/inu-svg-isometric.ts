import {AfterViewInit, Component, computed, effect, ElementRef, HostListener, input, viewChild} from '@angular/core';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {SVG_BUILDER, SVG_MATH, SVG_TRANSFORM} from 'inugami-ng/services';
import {RectOption} from 'inugami-ng/models';

@Component({
  selector: 'inu-svg-isometric',
  standalone: true,
  providers: [InuTemplateRegistryService],
  imports: [
  ],
  template: `
    <div [class]="_styleClass()" #component>
      <svg #container xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
  `,
  styleUrl: './inu-svg-isometric.scss',
})
export class InuSvgIsometric implements AfterViewInit {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
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
  //--- SVG components
  height: number = 400;
  width: number = 600;
  parent: HTMLElement | null = null;
  locator: SVGElement | null = null;
  canvas: SVGElement | null = null;
  graph: SVGElement | null = null;

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
    this.locator = SVG_BUILDER.createGroup(container?.nativeElement, {styleClass: 'locator'});
    this.canvas = SVG_BUILDER.createGroup(this.locator, {styleClass: 'canvas'});


    if (this.canvas) {
      this.graph = SVG_BUILDER.createGroup(this.canvas, {styleClass: 'graph'});
    }

    if (this.graph) {
      this.renderBackground(this.graph);
      this.renderGrid(this.graph);

    }

    this.updateValues();
  }

  //--------------------------------------------------------------------------------------------------------------------
  // GRID
  //--------------------------------------------------------------------------------------------------------------------
  private renderBackground(graph: SVGElement):SVGElement|null {
   return SVG_BUILDER.createRect(graph, {height:this.height , width:this.width, styleClass:'inu-svg-isometric-border'});
  }
  private renderGrid(graph: SVGElement) {
    SVG_BUILDER.createGroup(graph, {styleClass:'inu-svg-isometric-grid'});

  }

  //====================================================================================================================
  // UPDATE VALUES
  //====================================================================================================================
  public updateValues() {

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
