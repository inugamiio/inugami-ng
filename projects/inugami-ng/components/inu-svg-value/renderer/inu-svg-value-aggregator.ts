import {BucketTimed, ResourceTimed} from 'inugami-ng/models'

export class InuSvgValueAggregator {


  // ===================================================================================================================
  // SUM
  // ===================================================================================================================
  public static sum(values ?: BucketTimed<number>[]): BucketTimed<number>[] {
    const result: BucketTimed<number>[] = [];
    if (!values) {
      return result;
    }


    for (const bucket of values) {
      const resources = InuSvgValueAggregator.sumAggregateResources(bucket.resources);
      result.push({
                    name     : bucket.name,
                    tags     : bucket.tags,
                    resources: resources
                  });
    }
    console.log('sum', result)
    return result;
  }

  public static sumAggregateResources(resources?: ResourceTimed<number>[]): ResourceTimed<number>[] {
    const result: ResourceTimed<number>[] = [];
    if (!resources) {
      return [];
    }
    for (const resource of resources) {
      let date: Date    = new Date();
      let value: number = 0;
      for (const valuePoint of resource.values) {
        value += valuePoint.value;
        date = valuePoint.time;
      }
      result.push({
                    values: [{value: value, time: date}],
                    unit  : resource.unit,
                    uri   : resource.uri
                  })
    }
    return result;
  }
}
