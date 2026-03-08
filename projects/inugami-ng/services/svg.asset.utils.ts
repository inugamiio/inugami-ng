import {Point, Size, SvgAssetDTO, SvgAssetDTOOptions, SvgAssetElement} from 'inugami-ng/models';
import {SVG, SVG_ASSETS, SVG_BUILDER, SVG_MATH, SVG_TRANSFORM} from "./svg.utils";


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

class Asset implements SvgAssetElement {
  //--------------------------------------------------------------------------------------------------------------------
  // ATTRIBUTES
  //--------------------------------------------------------------------------------------------------------------------
  parent: SVGElement | HTMLElement;
  center: Point;
  scale: number;
  isometric: boolean;
  enableHitBox: boolean;
  assetSet: string;
  assetName: string;
  name: string;
  node: SVGElement;
  size: number;
  state: string;
  title: string;
  type: string;
  styleClass: string;
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
    this.scale = option.scale;
    this.isometric = option.isometric==undefined?false:option.isometric;
    this.assetSet = option.asset.assetSet!;
    this.assetName = option.asset.assetName!;
    this.enableHitBox = option.enableHitBox == undefined ? false : option.enableHitBox!;
    this.styleClass = option.styleClass!;
    this.type = option.asset.type ? option.asset.type : DEFAULT;
    this.state = option.asset.state ? option.asset.state : DEFAULT;
    this.name = option.asset.name!;
    this.title = option.title ? option.title : '';
    this.size = option.asset.size == undefined ? 1 : option.asset.size < 0 ? 1 : option.asset.size;
    this.x = option.asset.x;
    this.y = option.asset.y;
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
    let assetContent = SVG_ASSETS.getAsset(this.assetSet, this.assetName);
    if (!assetContent) {
      return;
    }
    let type = assetContent.types.find(t => t.name == this.type);
    if (!type) {
      type = assetContent.types.find(t => t.name == DEFAULT);
    }
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
    if (this.enableHitBox) {
      const hitboxGrp = SVG_BUILDER.createGroup(this.node, {styleClass: `hitbox-grp`});
      const content = SVG_BUILDER.createGroup(hitboxGrp, {styleClass: `content`});
      if (content && hitboxGrp) {
        content.innerHTML = state.content;
        const size = SVG_MATH.size(content);
        SVG_BUILDER.createRect(hitboxGrp, {height: size.height, width: size.width, styleClass: 'hitbox'});
      }
    } else {
      this.node.innerHTML = state.content;
    }


    this.node.onmouseenter = (event) => this.onover(event, self);
    this.node.onclick = (event) => this.onclick(event, self);
    this.node.onmousedown = (event) => this.onmousedown(event, self);
    this.node.onmousemove = (event) => this.onmousemove(event, self);
    this.node.onmouseleave = (event) => this.onmouseleave(event, self);
    this.node.ondblclick = (event) => this.ondblclick(event, self);
    this.node.ondrag = (event) => this.ondrag(event, self);
    this.node.ondrop = (event) => this.ondrop(event, self);
    this.node.ondragend = (event) => this.ondragend(event, self);
    this.node.ondragstart = (event) => this.ondragstart(event, self);
    this.node.ondragleave = (event) => this.ondragleave(event, self);
    this.node.ondragover = (event) => this.ondragover(event, self);
    this.node.ondragenter = (event) => this.ondragenter(event, self);
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

    let x = this.center.x + (this.x * this.scale);
    let y = this.center.y + (this.y * this.scale);
    if (this.isometric) {
      y = y / Math.sqrt(3)
    }
    SVG_TRANSFORM.translateY(this.node, y);
    SVG_TRANSFORM.translateX(this.node, x);
  }

  //--------------------------------------------------------------------------------------------------------------------
  // EVENT
  //--------------------------------------------------------------------------------------------------------------------

  updateValue(value: SvgAssetDTO) {
    this.assetSet = value.assetSet;
    this.type = value.type ? value.type : DEFAULT;
    this.state = value.state ? value.state : DEFAULT;
    this.name = value.name;
    this.title = value.title ? value.title : '';
    this.size = value.size < 0 ? 1 : value.size;
    this.x = value.x;
    this.y = value.y;
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

  getComponentSize(): Size {
    return SVG.MATH.size(this.node);
  }

  move(point: Point): void {
    SVG_TRANSFORM.translateX(this.node, point.x);
    SVG_TRANSFORM.translateY(this.node, point.y);
  }

}
