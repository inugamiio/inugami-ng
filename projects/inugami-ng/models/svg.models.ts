export interface TransformationInfo {
  x: number | null;
  y: number | null;
  scaleX: number | null;
  scaleY: number | null;
}


export interface Dimension {
  height: number;
  width: number;
  font: number;
}

export interface Position {
  x: number;
  y: number;
  cmd?: string;
}

export interface Size {
  height: number;
  width: number;
  bottom: number;
  left: number;
  right: number;
  top: number;
  x: number;
  y: number;
  fontratio?: number | null;
}

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  start: Point;
  end: Point;
}

export interface SvgStyle {
  style?: string;
  styleclass?: string;
}


export interface SvgLayerDTO {
  name: string;
  asserts: SvgAssetDTO[];
}

export interface SvgAssetDTO {
  name: string;
  assetSet: string;
  assetName: string;
  x: number;
  y: number;
  size: number;
  type?: string;
  state?: string;
  title?: string;
  styleClass?: string;
}

export interface SvgAssetDTOOptions {
  asset: SvgAssetDTO,
  scale: number,

  node?: SVGElement,
  parent?: SVGElement | HTMLElement | null,
  center?: Point,
  enableHitBox?: boolean,
  isometric?: boolean,
  styleClass?: string
  name?: string,
  title?: string
}

export interface SvgAssetElement {
  name: string;
  assetSet: string;
  assetName: string;
  x: number;
  y: number;
  size: number;
  type?: string;
  state?: string;
  title?: string;
  node?: SVGElement;
  update: (value: SvgAssetDTO, center: Point, scale: number, isometric: boolean) => void;

  addStyleClass(style: string): void;
  removeStyleClass(style: string): void;
  remove(): void;
  moveDrag(point: Point, zoom:number): void;
  move(point: Point): void;
  getComponentSize(): Size;
  isDrag(): boolean;

  onover: (event: MouseEvent, asset: SvgAssetElement) => void;
  onclick: (event: PointerEvent, asset: SvgAssetElement) => void;
  onmousedown: (event: MouseEvent, asset: SvgAssetElement) => void;
  onmousemove: (event: MouseEvent, asset: SvgAssetElement) => void;
  onmouseleave: (event: MouseEvent, asset: SvgAssetElement) => void;
  ondblclick: (event: MouseEvent, asset: SvgAssetElement) => void;
  ondrag: (event: DragEvent, asset: SvgAssetElement) => void;
  ondrop: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragend: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragstart: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragleave: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragover: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragenter: (event: DragEvent, asset: SvgAssetElement) => void;


}

export interface SvgLayerElement {
  name: string;
  node: SVGElement;
  assets: SvgAssetElement[];
}

export interface SvgButton {
  name: string;
  icon: string;
  type?: string;
  state?: string;
  onover?: (event: MouseEvent, asset: SvgAssetElement) => void;
  onclick?: (event: PointerEvent, asset: SvgAssetElement) => void;
  onmousedown?: (event: MouseEvent, asset: SvgAssetElement) => void;
  onmousemove?: (event: MouseEvent, asset: SvgAssetElement) => void;
  onmouseleave?: (event: MouseEvent, asset: SvgAssetElement) => void;
  ondblclick?: (event: MouseEvent, asset: SvgAssetElement) => void;
  ondrag?: (event: DragEvent, asset: SvgAssetElement) => void;
  ondrop?: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragend?: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragstart?: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragleave?: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragover?: (event: DragEvent, asset: SvgAssetElement) => void;
  ondragenter?: (event: DragEvent, asset: SvgAssetElement) => void;
}
