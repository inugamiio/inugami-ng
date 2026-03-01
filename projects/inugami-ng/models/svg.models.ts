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
  assertSet: string;
  assertName: string;
  x: number;
  y: number;
  size: number;
  type?: string;
  state?: string;
  title?: string;
  styleClass?: string;
}


export interface SvgAssetElement {
  name: string;
  assertSet: string;
  assertName: string;
  x: number;
  y: number;
  size: number;
  type?: string;
  state?: string;
  title?: string;
  node?: SVGElement;
  update: (value: SvgAssetDTO, center: Point, scale: number, isometric: boolean) => void;

  remove(): void;
}

export interface SvgLayerElement {
  name: string;
  node: SVGElement;
  assets: SvgAssetElement[];
}
