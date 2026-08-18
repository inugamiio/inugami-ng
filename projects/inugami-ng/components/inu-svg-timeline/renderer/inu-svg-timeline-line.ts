import {
  BucketTimed,
  PointTimed,
  ResourceTimedSelected,
  TimeLineRenderer,
  TimeLineRendererContext
} from 'inugami-ng/models';
import {Observable, of} from 'rxjs';
import {SVG_ANIMATION, SVG_BUILDER, SVG_TRANSFORM} from 'inugami-ng/services';
import {signal} from '@angular/core';
import {ObservableSubscriber} from 'inugami-ng/utils'

interface PathInfo {
  element: SVGElement;
  points: { x: number; targetY: number }[];
  circles: SVGElement[];
}

const NOT_HOVER = 'not-hover'
const HOVER = 'hover'

const DATA_TIME = 'data-date'
const DATA_VALUE = 'data-value'
const DATA_BUCKET_INDEX = 'data-bucket-index'
const DATA_RESOURCE_INDEX = 'data-resource-index'
const DATA_VALUE_INDEX = 'data-value-index'


export class InuSvgTimelineLine implements TimeLineRenderer {

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
  smooth: boolean             = true;
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
    this.updateLayout();
  }

  //====================================================================================================================
  // COMPUTING
  //====================================================================================================================
  setMaxValue(value:number){
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

    if (!this.graph || this.data.length === 0) {
      result.next({});
      return result.observable();
    }

    const pathElements = Array.from(
      this.graph.querySelectorAll('.bucket-resource-line')
    ) as SVGElement[];

    if (pathElements.length === 0) {
      result.next({});
      return result.observable();
    }

    SVG_ANIMATION.animate(
      (progress: number) => {
        const factor = 1 - progress;

        for (const bucket of this.data) {
          for (const resource of bucket.resources ?? []) {
            const values       = resource.values ?? [];
            const res          = this.resolution ?? 100;
            const stepX        = (this.width ?? 400) / res;
            const canvasHeight = this.height ?? 1;
            const ratio        = canvasHeight / (this.maxValue() ?? 1);

            const points = values.map((val, i) => {
              const targetY = -((val.value ?? 0) * ratio) * factor;
              return {
                x: i * stepX + stepX / 2,
                y: targetY
              };
            });

            const d = this.buildPathString(points);

            for (const el of pathElements) {
              el.setAttribute('d', d);
            }
          }
        }
      },
      {
        duration: this.duration,
        timer   : SVG_ANIMATION.TYPES.easeOutCubic,
        onDone  : () => {
          while (this.graph?.firstChild) {
            this.graph.removeChild(this.graph.firstChild);
          }
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


    const pathInfos: PathInfo[] = [];
    const keys                  = Object.keys(this.nodes);
    let bucketIndex             = 0;

    for (const bucket of this.data) {
      if (!keys.includes(bucket.name)) {
        this.renderBucket(bucket, pathInfos, bucketIndex);
      }
      bucketIndex++;
    }

    if (animate) {
      SVG_ANIMATION.animate(
        (progress: number) => {
          for (const pathInfo of pathInfos) {
            const currentPoints = pathInfo.points.map(p => ({
              x: p.x,
              y: p.targetY * progress
            }));
            const d             = this.buildPathString(currentPoints);
            pathInfo.element.setAttribute('d', d);

            for (let i = 0; i < pathInfo.circles.length; i++) {
              pathInfo.circles[i].setAttribute('cy', `${pathInfo.points[i].targetY * progress}`);
            }
          }
        },
        {
          duration: this.duration,
          timer   : SVG_ANIMATION.TYPES.easeOutCubic
        }
      );
    } else {
      for (const pathInfo of pathInfos) {
        const currentPoints = pathInfo.points.map(p => ({
          x: p.x,
          y: p.targetY
        }));
        const d             = this.buildPathString(currentPoints);
        pathInfo.element.setAttribute('d', d);

        for (let i = 0; i < pathInfo.circles.length; i++) {
          pathInfo.circles[i].setAttribute('cy', `${pathInfo.points[i].targetY}`);
        }
      }
    }
  }

  private renderBucket(bucket: BucketTimed<number>, pathInfos: PathInfo[], bucketIndex: number) {
    if (!this.graph) {
      return;
    }

    const bucketGroup = SVG_BUILDER.createGroup(this.graph, {
      styleClass: ['bucket bucket-line', bucket.name, ...(bucket.tags ?? [])].join(' ')
    });

    let resourceIndex = 0;
    for (const resource of bucket.resources ?? []) {
      const resourceGroup = SVG_BUILDER.createGroup(bucketGroup, {
        styleClass: ['bucket-resource', resource.name].join(' ')
      });
      resourceGroup?.setAttribute('aria-uri', resource.uri ?? '');

      this.renderResourceLine(resource.values ?? [], resourceGroup, pathInfos, bucketIndex, resourceIndex);
      resourceIndex++;
    }
  }

  private renderResourceLine(
    values: PointTimed<number>[],
    parent: SVGElement | null,
    pathInfos: PathInfo[],
    bucketIndex: number,
    resourceIndex: number
  ) {
    if (!parent || !values || values.length === 0) {
      return;
    }

    const maxValue     = this.maxValue() ?? 1;
    const canvasHeight = this.height ?? 1;
    const ratio        = canvasHeight / maxValue;
    const res          = this.resolution ?? 100;
    const stepX        = (this.width ?? 400) / res;

    const points: { x: number; targetY: number }[] = [];

    for (let i = 0; i < values.length; i++) {
      const val = values[i];
      if (!val || val.value === undefined) continue;
      const x       = i * stepX + stepX / 2;
      const targetY = -(val.value * ratio);

      points.push({x, targetY});
    }

    if (points.length === 0) return;

    const pathElement = SVG_BUILDER.createCurve(parent, '', {
      styleClass: 'bucket-resource-line'
    });

    const dotsGroup = SVG_BUILDER.createGroup(parent, {styleClass:'dot-grp'});
    const circles: SVGElement[] = [];

    for (let i = 0; i < values.length; i++) {
      const p = points[i];
      const val = values[i];
      if (!p || !val) continue;

      const circle = SVG_BUILDER.createCircle(dotsGroup, {styleClass:'bucket-resource-point',round:4, x:p.x, y:0});

      if(circle && dotsGroup){
        const timeStamp = val.time instanceof Date ? val.time.getTime() : val.time;
        circle.setAttribute(DATA_TIME, '' + timeStamp);
        circle.setAttribute(DATA_VALUE, '' + val.value);
        circle.setAttribute(DATA_BUCKET_INDEX, '' + bucketIndex);
        circle.setAttribute(DATA_RESOURCE_INDEX, '' + resourceIndex);
        circle.setAttribute(DATA_VALUE_INDEX, '' + i);

        circle.onmouseover = (e)=> this.onMouseHover(e);
        circle.onmouseleave = (e)=> this.onMouseLeave(e);

        dotsGroup.appendChild(circle);
        circles.push(circle);
      }
    }

    if (pathElement) {
      pathInfos.push({
                       element: pathElement,
                       points : points,
                       circles: circles
                     });
    }
  }

  private onMouseHover(event: MouseEvent) {
    const currentNode = event.currentTarget as SVGElement;
    SVG_TRANSFORM.addClass(currentNode, HOVER);

    for (const child of this.graph?.childNodes ?? []) {
      if (!child) {
        continue
      }
      SVG_TRANSFORM.addClass(child as SVGElement, NOT_HOVER);
    }

    const currentParent = (currentNode.parentNode as SVGElement)?.parentNode?.parentNode as SVGElement;
    if (currentParent) {
      SVG_TRANSFORM.removeClass(currentParent, NOT_HOVER);
      SVG_TRANSFORM.addClass(currentParent, HOVER);
    }

    const bucketIndex   = Number(currentNode.getAttribute(DATA_BUCKET_INDEX));
    const bucket        = this.data[bucketIndex];
    const resourceIndex = Number(currentNode.getAttribute(DATA_RESOURCE_INDEX));
    const resource      = bucket.resources[resourceIndex];
    const valueIndex    = Number(currentNode.getAttribute(DATA_VALUE_INDEX));

    const point = resource.values[valueIndex];

    const currentData : ResourceTimedSelected = {
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

  private onMouseLeave(event: MouseEvent) {
    const hoverData = this.hoverData();
    if(hoverData){
      this.leaveObservable.onNextValue(hoverData);
    }

    for (const child of this.graph?.childNodes ?? []) {
      if (!child) {
        continue
      }
      SVG_TRANSFORM.removeClass(child as SVGElement, NOT_HOVER);
      SVG_TRANSFORM.removeClass(child as SVGElement, HOVER);
      for(const subChild of child.childNodes??[]){
        SVG_TRANSFORM.removeClass(child as SVGElement, NOT_HOVER);
        SVG_TRANSFORM.removeClass(child as SVGElement, HOVER);
      }
    }
    const currentNode = event.currentTarget as SVGElement;
    SVG_TRANSFORM.removeClass(currentNode as SVGElement, NOT_HOVER);
    SVG_TRANSFORM.removeClass(currentNode as SVGElement, HOVER);
  }

  //====================================================================================================================
  // PATH GENERATION (SMOOTH vs STRAIGHT)
  //====================================================================================================================
  private buildPathString(points: { x: number; y: number }[]): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    if (!this.smooth) {
      return points.reduce(
        (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
        ''
      );
    }

    const n = points.length;
    let d   = `M ${points[0].x} ${points[0].y}`;

    const dxs: number[] = [];
    const dys: number[] = [];
    const ms: number[]  = [];

    for (let i = 0; i < n - 1; i++) {
      const dx = points[i + 1].x - points[i].x;
      const dy = points[i + 1].y - points[i].y;
      dxs.push(dx);
      dys.push(dy);
      ms.push(dy / (dx || 1));
    }

    const tangents: number[] = [ms[0]];
    for (let i = 0; i < n - 2; i++) {
      const m0 = ms[i];
      const m1 = ms[i + 1];
      if (m0 * m1 <= 0) {
        tangents.push(0);
      } else {
        const commonDx = dxs[i] + dxs[i + 1];
        tangents.push((3 * commonDx) / ((commonDx + dxs[i + 1]) / m0 + (commonDx + dxs[i]) / m1));
      }
    }
    tangents.push(ms[ms.length - 1]);

    for (let i = 0; i < n - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dx = dxs[i];

      const cp1x = p1.x + dx / 3;
      const cp1y = p1.y + (tangents[i] * dx) / 3;

      const cp2x = p2.x - dx / 3;
      const cp2y = p2.y - (tangents[i + 1] * dx) / 3;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
  }
  public isCumulative(){
    return false;
  }
}
