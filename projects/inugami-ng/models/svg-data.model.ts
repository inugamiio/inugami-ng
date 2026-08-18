import {Observable} from 'rxjs'

export interface BoundedTime{
  from?:Date;
  until?:Date;
}

export interface PointTimed<T = number> {
  value: T;
  time: Date;
  meta?: Record<string, string | number | boolean>;
}

export interface ResourceTimed<T = number> {
  uri: string;
  values: PointTimed<T>[];
  unit: string;
  name?: string;
}
export interface MouseEventData{
  altKey: boolean;
  button: number;
  buttons: number;
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  layerX: number;
  layerY: number;
  metaKey: boolean;
  movementX: number;
  movementY: number;
  offsetX: number;
  offsetY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
  shiftKey: boolean;
  x: number;
  y: number;
}

export interface ResourceTimedSelected{
  bucket ?: BucketTimed<number>;
  resource ?: ResourceTimed;
  point ?: PointTimed<number>;
  event ?: MouseEventData;
}


export interface BucketTimed<T = number> {
  name: string;
  resources: ResourceTimed<T>[];
  tags?: string[];
}


export type BucketTimedLoader<T = number> = (from: Date,
                                             until: Date,
                                             resolution: number) => Observable<BucketTimed<T>[]>;

export interface TimeLineRendererContext {
  graph: SVGElement;
  height: number;
  width: number;
  resolution: number;
}

export type TimeLineRendererBuilder = () => TimeLineRenderer;

export interface TimeLineRenderer {
  init: (context: TimeLineRendererContext) => void;
  updateContext: (height: number, width: number, resolution: number) => void;
  updateValues: (data: BucketTimed<number>[], animate?: boolean) => void;
  updateLayout: () => void;
  destroy: () => Observable<any>;
  isCumulative : ()=> boolean;
  setMaxValue : (value:number)=> void;
  hover : ()=> Observable<ResourceTimedSelected>;
  leave : ()=> Observable<ResourceTimedSelected>;
}
