import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  OnChanges,
  SimpleChanges,
  viewChild
} from '@angular/core';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {SVG_BUILDER, SVG_MATH, SVG_TRANSFORM} from 'inugami-ng/services';
import {SvgAsset} from 'inugami-svg-assets';

@Component({
  selector: 'inu-svg-asset',
  standalone: true,
  providers: [InuTemplateRegistryService],
  imports: [],
  template: `
    <div [class]="_styleClass()" #component>
      <svg #container xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
  `,
  styleUrl: './inu-svg-asset.scss',
})
export class InuSvgAsset implements AfterViewInit, OnChanges {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  asset = input<SvgAsset | undefined>(undefined);
  type = input<string | undefined>('default');
  state = input<string | undefined>('default');
  styleclass = input<string>('');
  //
  private component = viewChild<ElementRef<HTMLElement>>('component');
  private container = viewChild<ElementRef<HTMLElement>>('container');
  _styleClass = computed<string>(() => {
    return [
      'inu-svg',
      'inu-svg-asset',
      this.styleclass() ? this.styleclass() : ''
    ].join(' ');
  })

  //--- SVG components
  height: number = 64;
  width: number = 64;
  parent: HTMLElement | null = null;
  locator: SVGElement | null = null;
  defs: SVGElement | null = null;
  canvas: SVGElement | null = null;
  graph: SVGElement | null = null;

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    effect(() => {
      console.log('effect')
      this.asset();
      this.type();
      this.state();

      if (this.graph) {
        this.updateValues();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes detected:', changes);
    this.updateValues();
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
    this.defs = SVG_BUILDER.createDefs(container?.nativeElement);
    this.locator = SVG_BUILDER.createGroup(container?.nativeElement, {styleClass: 'locator'});
    this.canvas = SVG_BUILDER.createGroup(this.locator, {styleClass: 'canvas'});


    if (this.canvas) {
      this.graph = SVG_BUILDER.createGroup(this.canvas, {styleClass: 'graph'});
    }

    this.updateValues();
  }


  //====================================================================================================================
  // UPDATE VALUES
  //====================================================================================================================
  public updateValues() {
    console.log('updateValues')
    const asset = this.asset();
    if (!asset || !this.graph) {
      return;
    }
    this.graph.replaceChildren();

    const type = this.type();
    const state = this.state();
    let currentType = asset.types.find(t => t.name == type);
    if (!currentType) {
      currentType = asset.types.find(t => t.name == 'default');
    }
    if (!currentType) {
      return;
    }
    let currentState = currentType.states.find(t => t.name == state);
    if (!currentState) {
      currentState = currentType.states.find(t => t.name == 'default');
    }
    if (currentState) {
      this.graph.innerHTML = currentState.content;
    }
    setTimeout(() => this.resize(), 0);
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
