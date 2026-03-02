import {
  CircleOption, RectOption, SvgAnimationCallback, SvgAnimationOption,
  SvgDefsPatternOption, SvgFilterOption, SvgOptionalOption, SvgTimerGenerator, TextOption
} from "./svg-options.model";
import {
  Dimension, Point,
  Position,
  Size,
  SvgAssetDTO,
  SvgAssetElement,
  SvgStyle,
  TransformationInfo,
  Vector
} from "./svg.models";
import {SvgAsset, SvgAssetSet} from "inugami-svg-assets";

export interface SvgAssets {
  getAssetSets : () => SvgAssetSet[];
  register : (sets:SvgAssetSet[]) => void;
  getAsset : (setName:string, assetName:string ) => SvgAsset|undefined;
}
export interface SvgTransform {
  clean  : (node: SVGElement) => void;
  translateX: (node: SVGElement | null, posX:number)=> void;
  translateY: (node: SVGElement | null, posY:number)=> void;
  scale  : (node: SVGElement , scaleX:number, scaleY:number)=> void;
  scaleX : (node: SVGElement , scaleX:number) => void;
  scaleY : (node: SVGElement , scaleY:number) => void;
  matrix : (node: SVGElement, scaleX:number,scaleY:number, posX:number, posY:number) => void;
  extractTransformInformation: (node: SVGElement|HTMLElement)=> TransformationInfo;
  center: (compo:SVGElement, svgContainer: HTMLElement, onX: boolean, onY: boolean)=>number;
  toogleClass: (node:SVGElement|HTMLElement, styleclass:string)=> void;
  removeClass: (node:SVGElement|HTMLElement, styleclass:string)=>void;
  addClass: (node:SVGElement|HTMLElement, styleclass:string)=> void;
  hasClass: (node:SVGElement|HTMLElement, styleclass:string)=> boolean;
  _genericTransform : (node: SVGElement, transfo:TransformationInfo)=> void;
  _noScale : (data:TransformationInfo )=>boolean;
  _noTranslate : (data:TransformationInfo)=>boolean;
}

export interface SvgBuilder {
  createDefs: (parent: SVGElement|HTMLElement|null)=> SVGElement|null;
  createFilter: (parentDefs: SVGElement|HTMLElement|null, id:string, option?: SvgFilterOption)=> SVGElement|null;
  createDefsPattern: (parent: SVGElement|HTMLElement|null, id:string, option?: SvgDefsPatternOption)=> SVGElement|null;
  createGroup : (parent: SVGElement|HTMLElement|null, option?: SvgOptionalOption)=> SVGElement|null;
  createText : (label:string, parent: SVGElement, option?: SvgOptionalOption)=> SVGElement|null;
  createLine : (vector:Vector, parent: SVGElement, option?: SvgOptionalOption)=> SVGElement|null;
  createRect : (parent: SVGElement, option?: RectOption)=> SVGElement|null ;
  createCircle : (parent: SVGElement, option?: CircleOption)=> SVGElement|null ;
  createCurve: (parent: SVGElement,curve: string, option?: SvgOptionalOption)=> SVGElement|null ;
  ellipse: (layer: SVGElement, option?: CircleOption)=>SVGElement|null ;
  text: (layer: SVGElement, label: string,option?:TextOption )=>SVGElement|null ;
  createNode : (nodeType:string,parent: SVGElement|HTMLElement|null, option?: SvgOptionalOption)=> SVGElement|null;
  createAsset : (asset:SvgAssetDTO,
                 parent: SVGElement|HTMLElement|null,
                 center:Point,
                 scall:number,
                 isometric:boolean)=> SvgAssetElement|undefined;
}

export interface SvgMath {
  convertToRadian: (angle: number) => number;
  convertToDegre : (rad:number)=>number;
  rotate: (x: number, y: number, angle: number)=> Position;
  rotateByRef: (xRef: number, yRef: number, x: number, y: number, angle: number)=>Position;
  size : (node: SVGElement| HTMLElement)=> Size;
  computeDimension: (parent: SVGElement|HTMLElement, widthRatio:number|null, heightRatio:number|null, fontRatio:number)=> Dimension;
  nowNano : ()=> number;
  zoom : (value:number, zoom:number)=> number;
}


export type SvgStyleGenerator = (value:number, maxValue:number, minValue:number, type:string)=>SvgStyle;



export interface SvgStyleGenerators {
  BY_TYPE : SvgStyleGenerator
}

export interface SvgAnimations {
  TYPES : {
    linear:SvgTimerGenerator ,
    parabolic:SvgTimerGenerator ,
    easeOutCubic:SvgTimerGenerator ,
    easeInCubic:SvgTimerGenerator ,
    easeInQuad:SvgTimerGenerator ,
    easeOutQuad:SvgTimerGenerator
  },
  animate: (callback:SvgAnimationCallback, option?:SvgAnimationOption)=> void
}
