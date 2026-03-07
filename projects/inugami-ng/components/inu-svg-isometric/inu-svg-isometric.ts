import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  model,
  ModelSignal, signal,
  viewChild
} from '@angular/core';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {SVG, SVG_BUILDER, SVG_MATH, SVG_TRANSFORM, SvgAssetUtils} from 'inugami-ng/services';
import {Point, SvgAssetDTO, SvgAssetElement, SvgLayerDTO, SvgLayerElement} from 'inugami-ng/models';
import {FormValueControl} from '@angular/forms/signals';
import {InuSvgIsometricHud} from './inu-svg-isometric-hud';


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
  defaultSize: number = 50;
  zoom: number = 50;
  previousMouseMove: Point = {x: 0, y: 0};
  value: ModelSignal<SvgLayerDTO[]> = model(<SvgLayerDTO[]>[]);
  position: Point = {x: 0, y: 0};
  assetSelected = signal<SvgAssetElement | undefined>(undefined);
  trackMouseMove = signal<boolean>(false);
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
  hud: InuSvgIsometricHud | undefined = undefined;


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
      let startZoom = this.zoom;
      let endZoom = this.defaultSize;
      let delta = endZoom - startZoom;
      let currentX = 0;
      let currentY = 0;
      let x = 0;
      let y = 0;

      if (this.parent && this.locator) {
        const currentTransfoAttr = this.locator.getAttribute('transform');
        const currentTransfo = SVG_TRANSFORM.extractTransformInformation(this.locator);
        SVG_TRANSFORM.center(this.locator, this.parent, true, true);
        const centerTransfo = SVG_TRANSFORM.extractTransformInformation(this.locator);
        this.locator.setAttribute('transform', currentTransfoAttr!);
        currentX = currentTransfo.x!;
        currentY = currentTransfo.y!;
        x = centerTransfo.x! - currentX;
        y = centerTransfo.y! - currentY;

        startZoom = currentTransfo.scaleX!;
        endZoom = centerTransfo.scaleX!;
        delta = endZoom - startZoom;
      }

      SVG.ANIMATION.animate((progress: number) => {
        const newZoom = startZoom + (delta * progress);
        const newX = currentX + (x * progress);
        const newY = currentY + (y * progress);
        if (this.locator) {
          SVG_TRANSFORM.translateY(this.locator, newY);
          SVG_TRANSFORM.translateX(this.locator, newX);
          SVG_TRANSFORM.scale(this.locator, newZoom, newZoom);
        }
        this.updateGridSize(this.defaultSize * (newZoom));
      }, {
        duration: 2000,
        timer: SVG.ANIMATION.TYPES.easeOutCubic,
        onDone: () => {
          this.zoom = this.defaultSize;
          if (this.locator) {
            if (this.parent) {
              SVG_TRANSFORM.center(this.locator, this.parent, true, true);
              const doneTransfo = SVG_TRANSFORM.extractTransformInformation(this.locator);
              this.position.x = doneTransfo.x!;
              this.position.y = doneTransfo.y!;
            }
            this.updateGridSize(this.zoom);
          }
        }
      });
    }
  }

  private updateGridSize(zoom: number) {
    const width = SVG_MATH.zoom(1, zoom);
    const height = this.isometric() ? width / Math.sqrt(3) : width;

    if (this.patternGroup) {
      const currentZoom = width / this.defaultSize;
      SVG_TRANSFORM.scale(this.patternGroup, currentZoom, currentZoom);

      if (this.gridPattern) {
        this.gridPattern.setAttribute('height', `${height}`);
        this.gridPattern.setAttribute('width', `${width}`);
      }
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
    container.nativeElement.onmousedown = (event: MouseEvent) => this.trackMouse(true, event);
    container.nativeElement.onmouseup = (event: MouseEvent) => this.trackMouse(false, event);
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
    if (container?.nativeElement) {

      this.hud = new InuSvgIsometricHud({
        parent: container?.nativeElement,
        height: this.height,
        width: this.width
      });
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

  //--------------------------------------------------------------------------------------------------------------------
  // HUD
  //--------------------------------------------------------------------------------------------------------------------


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
      const zoom = width / this.defaultSize;
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
      const doneTransfo = SVG_TRANSFORM.extractTransformInformation(this.locator);
      this.position.x = doneTransfo.x!;
      this.position.y = doneTransfo.y!;
    }
    this.hud?.updatePosition(this.height, this.width);
  }

  private trackMouse(track: boolean, event: MouseEvent) {
    event.preventDefault();
    this.trackMouseMove.set(track);
    if (track) {
      this.previousMouseMove = {
        x: event.x,
        y: event.y
      };
    } else {
      this.previousMouseMove = {x: 0, y: 0};
    }
  }

  private moveViewport(event: MouseEvent) {
    event.preventDefault();
    const container = this.container()?.nativeElement;
    if (!container) {
      return;
    }

    const trackMouse = this.trackMouseMove();
    if (!trackMouse) {
      return;
    }
    const assetSelected = this.assetSelected();

    const currentMove: Point = {
      x: event.x,
      y: event.y
    };

    const delta: Point = {
      x: this.previousMouseMove.x - currentMove.x,
      y: this.previousMouseMove.y - currentMove.y
    }

    if (this.previousMouseMove) {

    }


    if (!assetSelected) {
      this.position.x = this.position.x - delta.x;
      this.position.y = this.position.y - delta.y;
      if (this.locator) {
        SVG.TRANSFORM.translateY(this.locator, this.position.y);
        SVG.TRANSFORM.translateX(this.locator, this.position.x);
      }
    } else {
      // mnage drag
    }

    this.previousMouseMove = currentMove;
  }


}
