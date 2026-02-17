
export interface SvgOptionalOption{
  styleClass?: string|null
}


export interface RectOption extends SvgOptionalOption{
  height?: number;
  width?: number;
  round?: number;
}

export interface CircleOption extends SvgOptionalOption{
  height?: number;
  width?:number;
  round?: number;
}

export interface TextOption extends SvgOptionalOption{
  fontSize?: number;
}

export type SvgAnimationDone = ()=> void;
export type SvgAnimationCallback = (time:number)=> void;
export type SvgTimerGenerator = (time:number)=>number;

export interface SvgAnimationOption {
  timer?:SvgTimerGenerator;
  delay?: number;
  duration?:number;
  onDone?:SvgAnimationDone;
}

export interface SvgAnimationParameters {
  timer:SvgTimerGenerator;
  delay: number;
  duration:number;
  startTime:number,
  ttl:number;
  callback:SvgAnimationCallback;
  onDone?:SvgAnimationDone;
}
