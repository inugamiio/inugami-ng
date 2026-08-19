import {Component} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuSvgValue} from 'inugami-ng/components/inu-svg-value';
import {InuRadioGroup} from 'inugami-ng/components/inu-radio-group'
import {InuCode} from 'inugami-ng/components/inu-code'
import {FormField} from '@angular/forms/signals'
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {InugamiTemplateDirective} from 'inugami-ng/directives'
import {InuCite} from 'inugami-ng/components/inu-cite'

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
