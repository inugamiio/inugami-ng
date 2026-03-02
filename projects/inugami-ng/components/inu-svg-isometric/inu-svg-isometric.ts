import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  model,
  ModelSignal,
  viewChild
} from '@angular/core';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {SVG, SVG_BUILDER, SVG_MATH, SVG_TRANSFORM, SvgAssetUtils} from 'inugami-ng/services';
import {Point, SvgAssetDTO, SvgAssetElement, SvgLayerDTO, SvgLayerElement} from 'inugami-ng/models';
import {FormValueControl} from '@angular/forms/signals';


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
export class InuSvgIsometric implements FormValueControl<SvgLayerDTO[]>, AfterViewInit {

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
  previousMouseMove: MouseEvent | undefined = undefined;
  value: ModelSignal<SvgLayerDTO[]> = model(<SvgLayerDTO[]>[]);
  position: Point = {x: 0, y: 0};
  //--- SVG components
  height: number = 400;
  width: number = 600;
  scale: number = 1;
  center: Point = {x: this.width / 2, y: this.height / 2};
  parent: HTMLElement | null = null;
  locator: SVGElement | null = null;
  defs: SVGElement | null = null;
  canvas: SVGElement | null = null;
  graph: SVGElement | null = null;
  gridPattern: SVGElement | null = null;
  patternGroup: SVGElement | null = null;
  gridPatternRect: SVGElement | null = null;
  layers: SVGElement | null = null;
  layersComponents: SvgLayerElement[] = [];

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    effect(() => {
      this.updateValues();
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

      const x = this.position.x < 0 ? -this.position.x : this.position.x;
      const y = this.position.y < 0 ? -this.position.y : this.position.y;

      SVG.ANIMATION.animate((progress: number) => {
        const newZoom = startZoom + (delta * progress);
        this.zoom = Math.max(0.001, newZoom);
        const newX = x * progress;
        const newY = y * progress;
        if (this.locator) {
          SVG.TRANSFORM.translateX(this.locator, this.position.x + newX);
          SVG.TRANSFORM.translateY(this.locator, this.position.y + newY);
        }

        this.updateAfterZoom();
      }, {
        duration: 2000,
        timer: SVG.ANIMATION.TYPES.easeOutCubic,
        onDone: () => {
          this.zoom = this.defaultZoom;
          if (this.locator) {
            this.position.x = 0;
            this.position.y = 0;
            SVG.TRANSFORM.translateX(this.locator, this.position.x);
            SVG.TRANSFORM.translateY(this.locator, this.position.y);
          }
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

    this.center = {x: this.width / 2, y: this.height / 2};
    container?.nativeElement.setAttribute('style', `display: block; height:${this.height}px;width:${this.width}px`);
  }

  private initializeLayout(container: ElementRef<HTMLElement>) {

    this.defs = SVG_BUILDER.createDefs(container?.nativeElement);
    const gridGrp = SVG_BUILDER.createGroup(container?.nativeElement);
    this.locator = SVG_BUILDER.createGroup(container?.nativeElement, {styleClass: 'locator'});
    this.canvas = SVG_BUILDER.createGroup(this.locator, {styleClass: 'canvas'});
    container.nativeElement.onmousemove = (event: MouseEvent) => this.moveViewport(event);

    if (this.defs) {
      this.createGridDefs(this.defs);
    }
    const filter = SVG_BUILDER.createFilter(this.defs, 'shadow', {style: 'color-interpolation-filters: sRGB;'});
    const gaussian = SVG_BUILDER.createNode('feGaussianBlur', filter);
    if (gaussian) {
      gaussian.setAttribute('stdDeviation', '1');
    }

    if (gridGrp) {
      this.renderGrid(gridGrp);
    }
    if (this.canvas) {
      this.graph = SVG_BUILDER.createGroup(this.canvas, {styleClass: 'graph'});
    }
    if (this.graph) {
      this.renderLayers(this.graph);
    }

    this.updateValues();
  }

  private renderLayers(graph: SVGElement) {
    this.layers = SVG_BUILDER.createGroup(this.graph, {styleClass: 'layers'});
  }

  private createLayer(name: string): SvgLayerElement | undefined {
    if (this.layers) {
      const layer = SVG_BUILDER.createGroup(this.layers, {styleClass: `layer ${name}`});
      if (layer) {
        const result = <SvgLayerElement>{
          name: name,
          node: layer,
          assets: []
        };
        this.layersComponents.push(result);
        return result;
      }
    }
    return undefined;
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
    const value = this.value();
    if (value.length == 0) {
      this.clearAllLayers();
    } else {
      for (let layer of value) {
        this.updateLayer(layer);
      }
    }
  }

  private clearAllLayers() {
    for (let layer of this.layersComponents) {
      for (let asset of layer.assets) {
        asset.remove();
      }
      layer.assets.splice(0, layer.assets.length - 1);
    }
  }


  private updateLayer(layer: SvgLayerDTO) {
    let currentLayer: SvgLayerElement | undefined | null = this.layersComponents.find(l => layer.name);
    if (!currentLayer) {
      currentLayer = this.createLayer(layer.name);
    }

    if (!currentLayer) {
      return;
    }

    const removedAssets = this.searchAssetsRemoved(layer.asserts, currentLayer.assets);
    removedAssets.forEach(a => a.remove());

    for (let asset of layer.asserts) {
      this.updateOrCreateAsset(asset, currentLayer);
    }
  }

  private searchAssetsRemoved(asserts: SvgAssetDTO[], existingAssets: SvgAssetElement[]): SvgAssetElement[] {
    const result: SvgAssetElement[] = [];
    for (let existingAsset of existingAssets) {
      const foundAsset = asserts.find(a => a.name == existingAsset.name);
      if (!foundAsset) {
        result.push(existingAsset);
      }
    }
    return result;
  }

  private updateOrCreateAsset(asset: SvgAssetDTO, layer: SvgLayerElement) {
    const existingAsset = layer.assets.find(a => a.name == asset.name);
    if (existingAsset) {
      existingAsset.update(asset, this.center, this.scale, this.isometric());
    } else {
      const newAsset = SvgAssetUtils.createAsset(asset, layer.node, this.center, this.scale, this.isometric());
      if (newAsset) {
        layer.assets.push(newAsset);
      }
    }
  }

  updateAfterZoom() {

    const width = SVG_MATH.zoom(1, this.zoom);
    const height = this.isometric() ? width / Math.sqrt(3) : width;

    if (this.patternGroup) {
      const zoom = width / this.defaultZoom;
      SVG_TRANSFORM.scale(this.patternGroup, zoom, zoom);
      if (this.layers) {
        SVG_TRANSFORM.scale(this.layers, zoom, zoom);
      }

      if (this.gridPattern) {
        this.gridPattern.setAttribute('height', `${height}`);
        this.gridPattern.setAttribute('width', `${width}`);
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

  private moveViewport(event: MouseEvent) {
    const container = this.container()?.nativeElement;
    if (!container) {
      return;
    }


    if (event.ctrlKey) {

      if (this.previousMouseMove) {
        let mainContentSize = SVG.MATH.size(container);
        console.log('moveViewport', event, mainContentSize)
        let posX = this.previousMouseMove.x - event.x;
        let posY = this.previousMouseMove.y - event.y;

        this.position.x = this.position.x - posX;
        this.position.y = this.position.y - posY;
        if (this.locator) {
          SVG.TRANSFORM.translateY(this.locator, this.position.y);
          SVG.TRANSFORM.translateX(this.locator, this.position.x);
        }
        this.previousMouseMove = event;
      } else {
        this.previousMouseMove = event;
      }


    } else {
      this.previousMouseMove = undefined;
    }
  }


}
