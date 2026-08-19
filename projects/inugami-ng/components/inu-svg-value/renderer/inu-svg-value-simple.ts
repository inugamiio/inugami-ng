import {BucketTimed, ResourceTimedSelected, TimeLineRendererContext, ValueRenderer} from 'inugami-ng/models';
import {Observable} from 'rxjs';
import {ObservableSubscriber} from 'inugami-ng/utils'
import {signal} from '@angular/core'



export class InuSvgValueSimple implements ValueRenderer {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  graph: SVGElement | undefined;
  height: number | undefined;
  width: number | undefined;
  resolution: number | undefined;
  duration: number = 500;
  data             = signal<BucketTimed<number>[]>([]);

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  init(context: TimeLineRendererContext): void {
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
    this.updateLayout(animate);
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
