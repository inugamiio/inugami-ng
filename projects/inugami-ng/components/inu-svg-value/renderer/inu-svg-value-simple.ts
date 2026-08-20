import {
  BucketTimed,
  ResourceTimedSelected,
  TimeLineRendererContext,
  ValueRenderer,
  ValueRendererContext
} from 'inugami-ng/models';
import {Observable} from 'rxjs';
import {InuFormsUtils, ObservableSubscriber} from 'inugami-ng/utils'
import {signal} from '@angular/core'


export class InuSvgValueSimple implements ValueRenderer {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  graph: SVGElement | undefined;
  height: number | undefined;
  width: number | undefined;
  resolution: number | undefined;
  duration: number = 1000;
  data             = signal<BucketTimed<number>[]>([]);

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor(duration?: number) {
    if (duration) {
      this.duration = duration
    }
    InuFormsUtils.onChanged(this.data).subscribe(value => {
      this.updateValues(value, true);
    });
  }

  init(context: ValueRendererContext): void {
    this.graph      = context.graph;
    this.height     = context.height;
    this.width      = context.width;
    this.resolution = context.resolution;
    this.updateLayout();
  }

  //====================================================================================================================
  // COMPUTING
  //====================================================================================================================
  updateContext(height: number, width: number, resolution: number): void {
    this.height     = height;
    this.width      = width;
    this.resolution = resolution;
  }

  destroy(): Observable<any> {
    const result = new ObservableSubscriber<any>();
    return result.observable();
  }

  updateValues(data: BucketTimed<number>[], animate?: boolean): void {
    this.data.set(data);
  }


  //====================================================================================================================
  // RENDERING
  //====================================================================================================================
  updateLayout(animate?: boolean) {
    if (!this.graph) {
      return;
    }


  }


}
