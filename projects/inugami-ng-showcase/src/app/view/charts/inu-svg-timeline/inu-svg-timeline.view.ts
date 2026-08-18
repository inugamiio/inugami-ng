import {Component, inject, signal} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuSvgTimeline, InuSvgTimelineHistogram, InuSvgTimelineLine} from 'inugami-ng/components/inu-svg-timeline';
import {
  BucketTimed,
  BucketTimedLoader,
  InuSelectItem,
  ResourceTimedSelected,
  TimeLineRenderer,
  TimeLineRendererBuilder
} from 'inugami-ng/models'
import {Observable} from 'rxjs'
import {HttpClient, HttpParams} from '@angular/common/http'
import {InuRadioGroup} from 'inugami-ng/components/inu-radio-group'
import {InuCode} from 'inugami-ng/components/inu-code'
import {FieldTree, form, FormField, required} from '@angular/forms/signals'
import {InuFormsUtils} from 'inugami-ng/utils'
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {InugamiTemplateDirective} from 'inugami-ng/directives'
import {InuCite} from 'inugami-ng/components/inu-cite'

interface TimeForm {
  dates: Date[];
}

@Component({
             templateUrl: './inu-svg-timeline.view.html',
             styleUrls  : ['./inu-svg-timeline.view.scss'],
             imports    : [
               InuTableFlex,
               InuTableFlexCell,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuSvgTimeline,
               InuRadioGroup,
               InuCode,
               FormField,
               InuPanelTab,
               InuPanelTabs,
               InuCite,
               InugamiTemplateDirective,
               InuCite
             ]
           })
export class InuSvgTimelineView {
  loadData                             = signal<BucketTimedLoader<number> | undefined>(undefined);
  from                                 = signal<Date>(new Date('2026-08-06T00:00:00.000+02:00'));
  until                                = signal<Date>(new Date('2026-08-06T23:59:00.000+02:00'));
  renderer                             = signal<TimeLineRendererBuilder>(() => new InuSvgTimelineHistogram());
  rendererForTemplate                  = signal<TimeLineRendererBuilder>(() => new InuSvgTimelineHistogram());
  resolution                           = signal<number>(250);
  rendererTypes                        = signal<InuSelectItem<TimeLineRenderer>[]>([
                                                                                     {
                                                                                       id      : 'InuSvgTimelineHistogram',
                                                                                       title   : 'Histograme',
                                                                                       value   : new InuSvgTimelineHistogram(),
                                                                                       selected: true
                                                                                     },
                                                                                     {
                                                                                       id   : 'InuSvgTimelineLine',
                                                                                       title: 'Line',
                                                                                       value: new InuSvgTimelineLine()
                                                                                     }
                                                                                   ]);
  resolutionTypes                      = signal<InuSelectItem<number>[]>([
                                                                           {
                                                                             id      : '100',
                                                                             title   : '100',
                                                                             value   : 100,
                                                                             selected: false
                                                                           },
                                                                           {
                                                                             id      : '250',
                                                                             title   : '250',
                                                                             value   : 250,
                                                                             selected: true
                                                                           },
                                                                           {
                                                                             id      : '1440',
                                                                             title   : '1440',
                                                                             value   : 1440,
                                                                             selected: false
                                                                           }
                                                                         ]);
  http                                 = inject(HttpClient);
  timeModel                            = signal<TimeForm>({
                                                            dates: [new Date('2026-08-06T00:00:00.000+02:00'),
                                                                    new Date('2026-08-06T23:59:00.000+02:00')]
                                                          });
  currentTimeForm: FieldTree<TimeForm> = form(this.timeModel, (path) => {
    required(path.dates);
  });
  formData                             = signal<string>('');
  lazyType                             = signal<string>('BucketTimedLoader<number>');
  defaultRenderer                      = signal<string>('() => new InuSvgTimelineHistogram()');
  eventResourceTimedSelected           = signal<string>('Event<ResourceTimedSelected>');
  eventBoundedTime           = signal<string>('Event<BoundedTime>');

  constructor() {
    this.loadData.set(this.processLoadingData.bind(this));
    InuFormsUtils.onChanged(this.timeModel)
      .subscribe(value => {
        this.formData.set(JSON.stringify(value, undefined, 4));
      });
  }


  private processLoadingData(from: Date,
                             until: Date,
                             resolution: number): Observable<BucketTimed<number>[]> {
    const currentRequest: any = {
      from      : from.getTime(),
      until     : until.getTime(),
      resolution: resolution
    };
    const params              = new HttpParams({fromObject: currentRequest});

    return this.http.get<BucketTimed<number>[]>(`api/svg/timeline`, {params})

  }


  protected rendererChange(event: TimeLineRenderer | undefined) {
    if (event) {
      this.renderer.set(() => event);
    }
  }

  protected resolutionChange(event: number | undefined) {
    if (event) {
      this.resolution.set(event);
    }
  }

  //====================================================================================================================
  // EVENT
  //====================================================================================================================
  hoverJson = signal<string>('');

  protected onHover(event: ResourceTimedSelected) {
    this.hoverJson.set(JSON.stringify(event, undefined, 4));
  }


}
