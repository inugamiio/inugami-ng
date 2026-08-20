import {Component, computed, inject, signal} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuSvgValue, InuSvgValueSimple} from 'inugami-ng/components/inu-svg-value';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {BucketTimed, BucketTimedLoader, ValueRenderer, ValueRendererBuilder} from 'inugami-ng/models'
import {HttpClient, HttpParams} from '@angular/common/http'

interface TimeForm {
  dates: Date[];
}

@Component({
             templateUrl: './inu-svg-value.view.html',
             styleUrls  : ['./inu-svg-value.view.scss'],
             imports    : [
               InuTableFlex,
               InuTableFlexCell,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuSvgValue,
               InuPanelTab,
               InuPanelTabs
             ]
           })
export class InuSvgValueView {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  from            = signal<Date>(new Date('2026-08-06T00:00:00.000+02:00'));
  until           = signal<Date>(new Date('2026-08-06T23:59:00.000+02:00'));
  loadData        = signal<BucketTimedLoader<number>>((from, until, resolution) => {
    const currentRequest = {
      from      : from.getTime(),
      until     : until.getTime(),
      resolution: resolution
    };
    const params         = new HttpParams({fromObject: currentRequest});

    return this.http.get<BucketTimed<number>[]>(`api/svg/timeline`, {params});
  });
  currentRenderer = signal<ValueRenderer>(new InuSvgValueSimple());
  renderer        = computed<ValueRendererBuilder>(() => () => this.currentRenderer());
  http            = inject(HttpClient);

  //====================================================================================================================
  // CONSTRUCTOR
  //====================================================================================================================
  constructor() {

  }


  //====================================================================================================================
  // EVENT
  //====================================================================================================================


}
