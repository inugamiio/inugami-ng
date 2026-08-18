import {BucketTimed, TimeLineRendererContext} from 'inugami-ng/models'

export class InuSvgTimelineUtilsUtils {

  public static histogram(data:BucketTimed<number>[],context:TimeLineRendererContext): void {
    const step = data.length/context.resolution;
    const nbItems = data.values.length;


    /*
    let  result :TimeLineValueNodes[]= data.graphNodes;
    if(data.timer){
      let first = true;

      SVG.ANIMATION.animate((time:number)=>{

        for(let i= 0; i< nbItems; i++){
          const value = data.values[i];
          const nodes = TIMELINE_GRAPH_RENDERING.__histogramRenderItem(value,i,step,i==0,i==nbItems-1, time,data,first);

          if(first){
            result.push(nodes);
          }
        }
        first = false;
        data.graphNodes = result;
      },{timer:data.timer, delay:data.delay,duration:data.duration })
    }else{
      for(let i= 0; i< nbItems; i++){
        const value = data.values[i];
        const nodes = TIMELINE_GRAPH_RENDERING.__histogramRenderItem(value,i,step,i==0,i==nbItems-1, 1,data, true);
        result.push(nodes);
      }
    }
    return result;

     */
  }
}
