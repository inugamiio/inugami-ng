import {Component, signal} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuCode} from 'inugami-ng/components/inu-code'
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {InuLoading} from 'inugami-ng/components/inu-loading';
import {InuButton} from 'inugami-ng/components/inu-button'

@Component({
             templateUrl: './inu-loading.view.html',
             styleUrls  : ['./inu-loading.view.scss'],
             imports: [
               InuTableFlex,
               InuTableFlexCell,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuCode,
               InuPanelTab,
               InuPanelTabs,
               InuLoading,
               InuButton
             ]
           })
export class InuLoadingView {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  defaultLoading = signal<boolean>(true);
  circleLoading = signal<boolean>(true);
  //==================================================================================================================
  // ACTIONS
  //==================================================================================================================
  toggleDefault(){
    this.defaultLoading.set(!this.defaultLoading());
  }
  toggleCircle(){
    this.circleLoading.set(!this.circleLoading());
  }
}
