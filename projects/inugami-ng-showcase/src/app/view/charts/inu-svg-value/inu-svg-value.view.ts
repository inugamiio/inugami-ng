import {Component} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuSvgValue} from 'inugami-ng/components/inu-svg-value';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';

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


  //====================================================================================================================
  // CONSTRUCTOR
  //====================================================================================================================
  constructor() {

  }


  //====================================================================================================================
  // EVENT
  //====================================================================================================================


}
