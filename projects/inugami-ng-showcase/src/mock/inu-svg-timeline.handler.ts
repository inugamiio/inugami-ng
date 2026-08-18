import {http, HttpResponse} from 'msw';
import {BucketTimed, PointTimed} from 'inugami-ng/models';
import {signal} from '@angular/core';

const baseHref = document.getElementsByTagName('base')[0]?.getAttribute('href') || '/';
const DATA     = signal<BucketTimed<number>[]>([]);

function filterValues(values: PointTimed<any>[],
                      from: number,
                      until: number,
                      stepMs: number,
                      resolution: number,
                      name: string,
                      uri: string): PointTimed<any>[] {

  const buckets: { totalValue: number; count: number; headMeta: any }[] = Array.from(
    {length: resolution},
    () => ({totalValue: 0, count: 0, headMeta: null})
  );

  if (values && values.length > 0 && stepMs > 0) {
    for (const item of values) {
      const timestamp = new Date(item.time).getTime();
      if (isNaN(timestamp) || timestamp < from || timestamp > until) continue;

      const rawIndex    = Math.floor((timestamp - from) / stepMs);
      const bucketIndex = Math.max(0, Math.min(resolution - 1, rawIndex));

      const b = buckets[bucketIndex];
      b.totalValue += (item.value || 0);
      b.count += 1;
      if (!b.headMeta) {
        b.headMeta = item.meta;
      }
    }
  }

  return buckets.map((b, index) => {
    const bucketStartMs = from + (index * stepMs);

    return {
      value: b.totalValue,
      time : new Date(bucketStartMs),
      meta : {
        ...(b.headMeta || {}),
        count: b.count,
        name,
        uri
      }
    };
  });
}

function filterData(data: BucketTimed<number>[], from: number, until: number, resolution: number) {
  if (until <= from || resolution <= 0) {
    return [];
  }
  const stepMs                        = (until - from) / resolution;
  const sourceData                    = data && data.length ? data : DATA();
  const result: BucketTimed<number>[] = structuredClone(sourceData);

  for (let bucket of result) {
    for (let resource of bucket.resources) {
      resource.values = filterValues(
        resource.values,
        from,
        until,
        stepMs,
        resolution,
        bucket.name,
        resource.uri
      );
    }
  }

  return result;
}

export const svgTimelineHandlers = [
  http.get('*/api/svg/timeline', async ({request}) => {
    if (DATA().length === 0) {
      const response = await fetch(`${baseHref}data/mock/svg/log-levels-timeline.json`.replace(/\/+/g, '/'));
      if (!response.ok) {
        return new HttpResponse('Mock file not found', {status: 404});
      }

      const data: BucketTimed<number>[] = await response.json() as BucketTimed<number>[];
      DATA.set(data);
    }

    const url        = new URL(request.url);
    const from       = Number(url.searchParams.get('from'));
    const until      = Number(url.searchParams.get('until'));
    const resolution = Number(url.searchParams.get('resolution')) || 300;

    return HttpResponse.json(filterData(DATA(), from, until, resolution));
  }),
];
