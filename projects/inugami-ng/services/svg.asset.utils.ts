import {Point, Size, SvgAssetDTO, SvgAssetDTOOptions, SvgAssetElement} from 'inugami-ng/models';
import {SVG, SVG_ASSETS, SVG_BUILDER, SVG_MATH, SVG_TRANSFORM} from "./svg.utils";
import {SvgAsset, SvgAssetState, SvgAssetType} from 'inugami-svg-assets';


export class SvgAssetUtils {

  public static createAsset(option: SvgAssetDTOOptions): SvgAssetElement | undefined {
    if (!option.parent) {
      return undefined;
    }

    const node = SVG_BUILDER.createGroup(option.parent, {});
    if (!node) {
      return undefined;
    }
    option.node = node;
    return new Asset(option);
  }
}


//======================================================================================================================
// ASSET
//======================================================================================================================
const DEFAULT = 'default';

const SELECTED = 'selected';

class Asset implements SvgAssetElement {
  //--------------------------------------------------------------------------------------------------------------------
  // ATTRIBUTES
  //--------------------------------------------------------------------------------------------------------------------
  assetName: string;
  assetSet: string;
  center: Point;
  drag: boolean = false;
  enableHitBox: boolean;
  isometric: boolean;
  name: string;
  node: SVGElement;
  parent: SVGElement | HTMLElement;
  scale: number;
  size: number;
  state: string;
  previousState: string | undefined = undefined;
  styleClass: string;
  title: string;
  type: string;
  x: number;
  y: number;

  onover: (event: MouseEvent, asset: SvgAssetElement) => void = (a) => {
  };
  onclick: (event: PointerEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  onmousedown: (event: MouseEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  onmousemove: (event: MouseEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  onmouseleave: (event: MouseEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  ondblclick: (event: MouseEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  ondrag: (event: DragEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  ondrop: (event: DragEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  ondragend: (event: DragEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  ondragstart: (event: DragEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  ondragleave: (event: DragEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  ondragover: (event: DragEvent, asset: SvgAssetElement) => void = (e, a) => {
  };
  ondragenter: (event: DragEvent, asset: SvgAssetElement) => void = (e, a) => {
  };

  //--------------------------------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  //--------------------------------------------------------------------------------------------------------------------

  constructor(option: SvgAssetDTOOptions) {
    this.parent = option.parent!;
    this.node = option.node!;
    this.center = option.center ? option.center : {x: 0, y: 0};
    this.scale = option.scale ? option.scale : 1;
    this.isometric = option.isometric == undefined ? false : option.isometric;
    this.assetSet = option.asset.assetSet!;
    this.assetName = option.asset.assetName!;
    this.enableHitBox = option.enableHitBox == undefined ? false : option.enableHitBox!;
    this.styleClass = option.styleClass!;
    this.type = option.asset.type ? option.asset.type : DEFAULT;
    this.state = option.asset.state ? option.asset.state : DEFAULT;
    this.name = option.asset.name!;
    this.title = option.title ? option.title : '';
    this.size = option.asset.size == undefined ? 1 : option.asset.size < 0 ? 1 : option.asset.size;
    this.x = this.toNumber(option.asset.x);
    this.y = this.toNumber(option.asset.y);
    this.updateStyleclass();
    this.processUpdateRender();
    this.updatePosition();

  }



  //--------------------------------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  //--------------------------------------------------------------------------------------------------------------------
  update(value: SvgAssetDTO, center: Point, scall: number, isometric: boolean): void {
    const previousAssertSet = `${this.assetSet}`;
    const previousAssertName = `${this.assetName}`;
    const previousType = `${this.type}`;
    const previousState = `${this.state}`;
    this.center = center;
    this.scale = scall;
    this.isometric = isometric;

    this.updateValue(value);
    this.updateRender(previousAssertSet, previousAssertName, previousType, previousState);
    this.updateStyleclass();
    this.updatePosition();
  }

  private updateRender(previousAssertSet: string, previousAssertName: string, previousType: string, previousState: string) {
    if (previousAssertSet == this.assetSet && previousType == this.type && previousState == this.state) {
      return;
    }
    this.processUpdateRender();
  }

  private processUpdateRender() {
    this.node.replaceChildren();
    const type = this.findAssetType();
    if (!type) {
      return;
    }

    let state = type.states.find(s => s.name == this.state);
    if (!state) {
      state = type.states.find(s => s.name == DEFAULT);
    }
    if (!state) {
      return;
    }
    const self = this;
    let assetStateContent: SVGElement | null | undefined = undefined;

    if (this.enableHitBox) {
      const hitboxGrp = SVG_BUILDER.createGroup(this.node, {styleClass: `hitbox-grp`});
      assetStateContent = SVG_BUILDER.createGroup(hitboxGrp, {styleClass: `content`});

      if (this.node && hitboxGrp) {
        const size = SVG_MATH.size(this.node);
        SVG_BUILDER.createRect(hitboxGrp, {height: size.height, width: size.width, styleClass: 'hitbox'});
      }
    } else {
      assetStateContent = this.node;
    }

    this.renderContent(assetStateContent, state);
    this.bindEvent(this.node);
  }


  private renderContent(content: SVGElement | null, assetContent: SvgAssetState) {
    if (!content) {
      return;
    }
    content.innerHTML = assetContent.content;
    this.replaceUse(content);
  }

  private replaceUse(node: SVGElement, parent?: SVGElement) {
    if (node.nodeName == 'use') {
      this.renderUseTarget(node, parent)
      node.remove();
    } else {
      for (let child of node.children) {
        this.replaceUse(child as SVGElement, node);
      }
    }
  }

  private renderUseTarget(node: SVGElement, parent?: SVGElement): void {
    const href = node.getAttribute('href');
    if (!href || !parent) {
      return;
    }
    this.processRenderUseTarget(href, parent);
  }


  private processRenderUseTarget(id: string, layer: SVGElement | null) {
    const parts = id.replaceAll('#', '').split(':');
    let asset: SvgAsset | undefined = undefined;
    if (parts.length >= 4) {
      asset = SVG_ASSETS.getAsset(parts[0], parts[1]);
    }
    if (asset) {
      const type = asset.types.find(t => t.name == parts[2]);
      let state: SvgAssetState | undefined = undefined;
      if (type) {
        state = type.states.find(s => s.name == parts[3]);
      }
      if (state) {
        const grp = SVG_BUILDER.createGroup(layer);
        if (grp) {
          grp.setAttribute('id', [parts[0], parts[1], parts[2], parts[3]].join(':'));
          grp.innerHTML = state.content;
        }

      }
    }
  }


  updateStyleclass() {
    const styleclass = [
      'inu-svg-asset',
      this.assetSet,
      'type-' + this.type,
      'type-state' + this.state,
      this.name,
      this.styleClass
    ];
    this.node.setAttribute('class', styleclass.join(' '));
  }

  private updatePosition() {
    SVG_TRANSFORM.scale(this.node, this.size * this.scale, this.size * this.scale)

    this.x = this.center.x + (this.x * this.scale);
    this.y = this.center.y + (this.y * this.scale);
    if (this.isometric) {
      this.y = this.y / Math.sqrt(3);
    }

    SVG_TRANSFORM.translateY(this.node, this.y);
    SVG_TRANSFORM.translateX(this.node, this.x);
  }


  //--------------------------------------------------------------------------------------------------------------------
  // EVENT
  //--------------------------------------------------------------------------------------------------------------------
  private bindEvent(node: SVGElement) {
    const self = this;
    this.node.onmouseenter = (event) => this.onover(event, self);
    this.node.onclick = (event) => this.onclick(event, self);
    this.node.onmousedown = (event) => {
      this.drag = true;
      this.onSelected();
      this.onmousedown(event, self);
    }
    this.node.onmouseup = (event: MouseEvent) => {
      this.drag = false;
      this.onDeselected();
    }
    this.node.onmousemove = (event) => this.onmousemove(event, self);
    this.node.onmouseleave = (event) => this.onmouseleave(event, self);
    this.node.ondblclick = (event) => this.ondblclick(event, self);
    this.node.ondrag = (event) => {
      this.drag = true;
      this.ondrag(event, self);
    };
    this.node.ondrop = (event) => this.ondrop(event, self);
    this.node.ondragend = (event) => {
      this.drag = false;
      this.ondragend(event, self);
    }
    this.node.ondragstart = (event) => {
      this.drag = true;
      this.ondragstart(event, self);
    };
    this.node.ondragleave = (event) => {
      this.drag = false;
      this.ondragleave(event, self);
    };
    this.node.ondragover = (event) => this.ondragover(event, self);
    this.node.ondragenter = (event) => this.ondragenter(event, self);
  }

  updateValue(value: SvgAssetDTO) {
    this.assetSet = value.assetSet;
    this.type = value.type ? value.type : DEFAULT;
    this.state = value.state ? value.state : DEFAULT;
    this.name = value.name;
    this.title = value.title ? value.title : '';
    this.size = value.size < 0 ? 1 : value.size;
    this.x = this.toNumber(value.x);
    this.y = this.toNumber(value.y);
  }


  private onSelected() {
    this.stateChange(SELECTED);

  }

  private onDeselected() {
    this.stateRevert();
  }

  //--------------------------------------------------------------------------------------------------------------------
  // ACTIONS
  //--------------------------------------------------------------------------------------------------------------------
  remove(): void {

  }

  addStyleClass(style: string): void {
    SVG_TRANSFORM.addClass(this.node, style);
  }

  removeStyleClass(style: string): void {
    SVG_TRANSFORM.removeClass(this.node, style);
  }

  moveDrag(position: Point, zoom: number): void {
    this.x = this.x - (position.x / zoom);
    this.y = this.y - (position.y / zoom);
    this.move({x: this.x, y: this.y});
  }

  move(position: Point): void {
    SVG_TRANSFORM.translateX(this.node, position.x);
    SVG_TRANSFORM.translateY(this.node, position.y);

  }

  stateChange(state: string): void {
    const type = this.findAssetType();
    const newState = type?.states.find(s => s.name == state);
    if (newState) {
      this.previousState = this.state;
      this.state = newState.name;
      this.processUpdateRender();
    }
  }
  stateRevert(): void {
    if(this.previousState){
      this.state = this.previousState ? this.previousState : DEFAULT;
      this.processUpdateRender();
      this.previousState = undefined;
    }
  }


  //--------------------------------------------------------------------------------------------------------------------
  // GETTERS
  //--------------------------------------------------------------------------------------------------------------------
  isDrag(): boolean {
    return this.drag;
  }

  getComponentSize(): Size {
    return SVG.MATH.size(this.node);
  }

  private toNumber(value: any): number {
    if (!value) {
      return 0;
    }
    try {
      const realValue = Number(value);
      return realValue;
    } catch (e) {
      return 0;
    }
  }


  private findAssetType(): SvgAssetType | undefined {
    let assetContent = SVG_ASSETS.getAsset(this.assetSet, this.assetName);
    if (!assetContent) {
      return;
    }
    let type = assetContent.types.find(t => t.name == this.type);
    if (!type) {
      type = assetContent.types.find(t => t.name == DEFAULT);
    }
    return type;
  }
}
