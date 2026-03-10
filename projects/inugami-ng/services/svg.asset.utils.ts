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
    this.scale = option.scale?option.scale:1;
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
        this.resolveRef(content);
      }
    } else {
      this.node.innerHTML = state.content;
      this.resolveRef(this.node);
    }


    this.node.onmouseenter = (event) => this.onover(event, self);
    this.node.onclick = (event) => this.onclick(event, self);
    this.node.onmousedown = (event) => {
      this.drag = true;
      this.onmousedown(event, self);
    }
    this.node.onmouseup = (event: MouseEvent) => {
      this.drag = false;
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

  private resolveRef(node: SVGElement) {
    const nodes:SVGElement[] = this.searchRef(node);
    for(let refNode of nodes){
      this.renderRef(refNode);
    }
  }
  private searchRef(node: SVGElement):SVGElement[] {
    const result:SVGElement[] = [];
    const ref = node.getAttribute('ref');
    if(ref){
      result.push(node);
    }
    else{
      if(node.children){
        for(let child of node.children){
          result.push(...this.searchRef(child as SVGElement))
        }
      }
    }

    return result;
  }

  private renderRef(refNode: SVGElement) {
    const ref = refNode.getAttribute('ref');
    if(!ref){
      return;
    }

    const parts = ref.split(':');
    const asset = SVG_ASSETS.getAsset(this.assetSet,this.assetName);
    let type =asset?.types.find(t=> t.name ==parts[0]);
    let state = type?.states?.find(s=> s.name == parts[1]);
//TODO
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
    this.x = this.toNumber(value.x);
    this.y = this.toNumber(value.y);
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

  moveDrag(position: Point, zoom:number): void {
    this.x = this.x-(position.x/zoom);
    this.y = this.y-(position.y/zoom);
    this.move({x: this.x, y: this.y});
  }

  move(position: Point): void {
    SVG_TRANSFORM.translateX(this.node, position.x);
    SVG_TRANSFORM.translateY(this.node, position.y);

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

  private toNumber(value: any):number {
    if(!value){
      return 0;
    }
    try{
      const realValue = Number(value);
      return realValue;
    }catch (e){
      return 0;
    }
  }



}
