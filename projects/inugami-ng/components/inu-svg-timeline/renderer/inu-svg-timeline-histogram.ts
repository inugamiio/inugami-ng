import {
  BucketTimed,
  PointTimed,
  ResourceTimedSelected,
  TimeLineRenderer,
  TimeLineRendererContext
} from 'inugami-ng/models'
import {Observable} from 'rxjs'
import {SVG, SVG_ANIMATION, SVG_BUILDER, SVG_TRANSFORM} from 'inugami-ng/services'
import {signal} from '@angular/core'
import {ObservableSubscriber} from 'inugami-ng/utils'

interface RectElementInfo {
  element: SVGElement;
  index: number;
  targetHeight: number;
}

const NOT_HOVER           = 'not-hover'
const HOVER               = 'hover'
const DATA_TIME           = 'data-date'
const DATA_VALUE          = 'data-value'
const DATA_BUCKET_INDEX   = 'data-bucket-index'
const DATA_RESOURCE_INDEX = 'data-resource-index'
const DATA_VALUE_INDEX    = 'data-value-index'

export class InuSvgTimelineHistogram implements TimeLineRenderer {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  graph: SVGElement | undefined;
  height: number | undefined;
  width: number | undefined;
  resolution: number | undefined;
  duration: number            = 500;
  data: BucketTimed<number>[] = [];
  maxValue                    = signal<number | undefined>(undefined);
  nodes: any                  = {};
  hoverObservable             = new ObservableSubscriber<ResourceTimedSelected>();
  leaveObservable             = new ObservableSubscriber<ResourceTimedSelected>();
  hoverData                   = signal<ResourceTimedSelected | undefined>(undefined);
  //====================================================================================================================
  // INIT
  //====================================================================================================================
  init(context: TimeLineRendererContext): void {
    this.graph      = context.graph;
    this.height     = context.height;
    this.width      = context.width;
    this.resolution = context.resolution;
    if (this.data && this.data.length > 0) {
      this.updateLayout(false);
    }
  }

  setMaxValue(value: number) {
    this.maxValue.set(value);
  }

  updateContext(height: number, width: number, resolution: number): void {
    this.height     = height;
    this.width      = width;
    this.resolution = resolution;
  }

  destroy(): Observable<any> {
    const result = new ObservableSubscriber<any>();

    this.hoverObservable.unsubscribe();
    this.leaveObservable.unsubscribe();

    if (!this.graph || !this.graph.firstChild) {
      result.next({});
      return result.observable();
    }

    const children = Array.from(this.graph.children) as SVGElement[];

    if (children.length === 0) {
      result.next({});
      return result.observable();
    }

    SVG_ANIMATION.animate(
      (progress: number) => {
        const scaleY = 1 - progress;

        for (const child of children) {
          SVG_TRANSFORM.scale(child, 1, scaleY);
        }
      },
      {
        duration: this.duration,
        timer   : SVG_ANIMATION.TYPES.easeOutCubic,
        onDone  : () => {
          result.next({});
        }
      }
    );

    return result.observable();
  }

  updateValues(data: BucketTimed<number>[], animate?: boolean): void {
    this.data = data;
    this.updateLayout(animate);
  }

  hover(): Observable<ResourceTimedSelected> {
    return this.hoverObservable.observable();
  }

  leave(): Observable<ResourceTimedSelected> {
    return this.leaveObservable.observable();
  }

  //====================================================================================================================
  // RENDERING WITH SMOOTH DOM ANIMATION
  //====================================================================================================================
  updateLayout(animate?: boolean) {
    if (!this.graph) {
      return;
    }

    while (this.graph.firstChild) {
      this.graph.removeChild(this.graph.firstChild);
    }


    const rectInfos: RectElementInfo[] = [];
    const keys                         = Object.keys(this.nodes);
    let bucketIndex                    = 0;
    for (let bucket of this.data) {
      if (!keys.includes(bucket.name)) {
        this.renderBucket(bucket, rectInfos, bucketIndex);
      }
      bucketIndex++;
    }

    if (animate) {
      this.applyFrame(rectInfos, 0);

      SVG_ANIMATION.animate(
        (progress: number) => {
          this.applyFrame(rectInfos, progress);
        },
        {
          duration: this.duration,
          timer   : SVG_ANIMATION.TYPES.easeOutCubic
        }
      );
    } else {
      const res            = this.resolution ?? 100;
      const width          = (this.width ?? 400) / res;
      const stackedOffsets = new Array(res).fill(0);
      for (const item of rectInfos) {
        const currentHeight = item.targetHeight;
        const currentOffset = stackedOffsets[item.index] ?? 0;
        const posY          = -(currentOffset + currentHeight);

        item.element.setAttribute('height', '' + currentHeight);
        SVG.TRANSFORM.matrix(item.element, 1, 1, width * item.index, posY);
        stackedOffsets[item.index] = currentOffset + currentHeight;
      }
    }

  }

  private applyFrame(rectInfos: RectElementInfo[], progress: number) {
    const res            = this.resolution ?? 100;
    const width          = (this.width ?? 400) / res;
    const stackedOffsets = new Array(res).fill(0);

    for (const item of rectInfos) {
      const currentHeight = item.targetHeight * progress;
      const currentOffset = stackedOffsets[item.index] ?? 0;
      const posY          = -(currentOffset + currentHeight);

      item.element.setAttribute('height', '' + currentHeight);
      SVG.TRANSFORM.matrix(item.element, 1, 1, width * item.index, posY);
      stackedOffsets[item.index] = currentOffset + currentHeight;
    }
  }

  private renderBucket(bucket: BucketTimed<number>, rectInfos: RectElementInfo[], bucketIndex: number) {
    if (!this.graph) {
      return;
    }
    const result = SVG_BUILDER.createGroup(this.graph, {
      styleClass: ['bucket',
                   bucket.name,
                   ...bucket.tags ?? []].join(' ')
    });

    this.renderBucketResources(bucket, result, rectInfos, bucketIndex);
  }

  private renderBucketResources(bucket: BucketTimed<number>,
                                result: SVGElement | null,
                                rectInfos: RectElementInfo[],
                                bucketIndex: number) {
    let resourceIndex = 0;
    for (let resource of bucket.resources ?? []) {
      const resultResource = SVG_BUILDER.createGroup(result, {
        styleClass: ['bucket-resource',
                     resource.name].join(' ')
      });
      resultResource?.setAttribute('aria-uri', resource.uri ?? '');

      const values = resource.values ?? [];
      for (let i = 0; i < values.length; i++) {
        this.renderValueNode(values[i], resultResource, i, rectInfos, bucketIndex, resourceIndex);
      }
      resourceIndex++;
    }
  }

  private renderValueNode(value: PointTimed<number>,
                          resultResource: SVGElement | null,
                          index: number,
                          rectInfos: RectElementInfo[],
                          bucketIndex: number,
                          resourceIndex: number) {
    if (!resultResource || !value || value.value === undefined) {
      return;
    }

    const maxValue     = this.maxValue() ?? 1;
    const canvasHeight = this.height ?? 1;
    const ratio        = canvasHeight / maxValue;
    const targetHeight = value.value * ratio;
    const width        = (this.width ?? 400) / (this.resolution ?? 100);

    const result = SVG_BUILDER.createRect(resultResource, {
      styleClass: ['bucket-resource-value'].join(' '),
      height    : 0,
      width     : width
    });

    if (!result) {
      return;
    }

    const timeStamp = value.time instanceof Date ? value.time.getTime() : value.time;
    result.setAttribute(DATA_TIME, '' + timeStamp);
    result.setAttribute(DATA_VALUE, '' + value.value);
    result.setAttribute(DATA_BUCKET_INDEX, '' + bucketIndex);
    result.setAttribute(DATA_RESOURCE_INDEX, '' + resourceIndex);
    result.setAttribute(DATA_VALUE_INDEX, '' + index);
    result.onmouseover  = (event) => this.onHover(event);
    result.onmouseleave = (event) => this.onLeave(event);
    rectInfos.push({
                     element     : result,
                     index       : index,
                     targetHeight: targetHeight
                   });
  }

  public isCumulative() {
    return true;
  }

  private onHover(event: MouseEvent) {
    const currentNode = event.currentTarget as SVGElement;
    SVG_TRANSFORM.addClass(currentNode, HOVER);

    const currentParent = (currentNode.parentNode as SVGElement)?.parentNode as SVGElement;
    const grandParent   = currentParent?.parentNode;
    for (const child of this.graph?.childNodes ?? []) {
      SVG_TRANSFORM.addClass(child as SVGElement, NOT_HOVER);
    }

    if (currentParent) {
      SVG_TRANSFORM.removeClass(currentParent, NOT_HOVER);
      SVG_TRANSFORM.addClass(currentParent, HOVER);
    }

    const bucketIndex   = Number(currentNode.getAttribute(DATA_BUCKET_INDEX));
    const bucket        = this.data[bucketIndex]
    const resourceIndex = Number(currentNode.getAttribute(DATA_RESOURCE_INDEX));
    const resource      = bucket.resources[resourceIndex];
    const valueIndex    = Number(currentNode.getAttribute(DATA_VALUE_INDEX));

    const point = resource.values[valueIndex];

    const currentData: ResourceTimedSelected = {
      event : SVG_BUILDER.buildMouseEvent(event),
      bucket: <BucketTimed<number>>{
        name     : bucket.name,
        tags     : bucket.tags,
        resources: [
          {
            uri   : resource.uri,
            unit  : resource.unit,
            values: [point]
          }
        ]
      },
      resource : resource,
      point : point
    };
    this.hoverData.set(currentData);
    this.hoverObservable.onNextValue(currentData);
  }

  private onLeave(event: MouseEvent) {

    const hoverData = this.hoverData();
    if (hoverData) {
      this.leaveObservable.onNextValue(hoverData);
    }

    for (const child of this.graph?.childNodes ?? []) {
      if (!child) {
        continue
      }
      SVG_TRANSFORM.removeClass(child as SVGElement, NOT_HOVER);
      SVG_TRANSFORM.removeClass(child as SVGElement, HOVER);
      for (const subChild of child.childNodes ?? []) {
        SVG_TRANSFORM.removeClass(child as SVGElement, NOT_HOVER);
        SVG_TRANSFORM.removeClass(child as SVGElement, HOVER);
      }
    }
    const currentNode = event.currentTarget as SVGElement;
    SVG_TRANSFORM.removeClass(currentNode as SVGElement, NOT_HOVER);
    SVG_TRANSFORM.removeClass(currentNode as SVGElement, HOVER);
  }
}
