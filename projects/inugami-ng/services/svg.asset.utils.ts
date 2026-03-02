import {Point, SvgAssetDTO, SvgAssetElement} from 'inugami-ng/models';
import {SVG_ASSETS, SVG_BUILDER, SVG_TRANSFORM} from "./svg.utils";



export class SvgAssetUtils {

  public static createAsset(asset: SvgAssetDTO,
                            parent: SVGElement | HTMLElement | null,
                            center: Point,
                            scall: number,
                            isometric: boolean): SvgAssetElement | undefined {
    if (!parent) {
      return undefined;
    }

    const node = SVG_BUILDER.createGroup(parent, {});
    if (!node) {
      return undefined;
    }
    return new Asset(node, parent, asset, center, scall, isometric);
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
  assertSet: string;
  assertName: string;
  name: string;
  node: SVGElement;
  size: number;
  state: string;
  title: string;
  type: string;
  x: number;
  y: number;

  //--------------------------------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  //--------------------------------------------------------------------------------------------------------------------
  constructor(node: SVGElement, parent: SVGElement | HTMLElement, asset: SvgAssetDTO, center: Point, scall: number, isometric: boolean) {
    this.parent = parent;
    this.node = node;
    this.center = center;
    this.scale = scall;
    this.isometric = isometric;
    this.assertSet = asset.assertSet;
    this.assertName = asset.assertName;
    this.type = asset.type ? asset.type : DEFAULT;
    this.state = asset.state ? asset.state : DEFAULT;
    this.name = asset.name;
    this.title = asset.title ? asset.title : '';
    this.size = asset.size < 0 ? 1 : asset.size;
    this.x = asset.x;
    this.y = asset.y;
    this.updateStyleclass();
    this.processUpdateRender();
    this.updatePosition();
  }

  remove(): void {
    throw new Error("Method not implemented.");
  }


  //--------------------------------------------------------------------------------------------------------------------
  // CONSTRUCTOR
  //--------------------------------------------------------------------------------------------------------------------
  update(value: SvgAssetDTO, center: Point, scall: number, isometric: boolean): void {
    const previousAssertSet = `${this.assertSet}`;
    const previousAssertName = `${this.assertName}`;
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

  updateValue(value: SvgAssetDTO) {
    this.assertSet = value.assertSet;
    this.type = value.type ? value.type : DEFAULT;
    this.state = value.state ? value.state : DEFAULT;
    this.name = value.name;
    this.title = value.title ? value.title : '';
    this.size = value.size < 0 ? 1 : value.size;
    this.x = value.x;
    this.y = value.y;
  }

  private updateRender(previousAssertSet: string, previousAssertName: string, previousType: string, previousState: string) {
    if (previousAssertSet == this.assertSet && previousType == this.type && previousState == this.state) {
      return;
    }
    this.processUpdateRender();
  }

  private processUpdateRender() {
    this.node.replaceChildren();
    let assetContent = SVG_ASSETS.getAsset(this.assertSet, this.assertName);
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
    this.node.innerHTML = state.content;
  }

  updateStyleclass() {
    const styleclass = ['inu-svg-asset', this.assertSet, 'type-' + this.type, 'type-state' + this.state, this.name];
    this.node.setAttribute('class', styleclass.join(' '));
  }

  private updatePosition() {
    SVG_TRANSFORM.scale(this.node, this.size * this.scale, this.size * this.scale)

    let x = this.center.x + (this.x * this.scale);
    let y = this.center.y + (this.y * this.scale);
    SVG_TRANSFORM.translateY(this.node, y);
    SVG_TRANSFORM.translateX(this.node, x);
  }


}
