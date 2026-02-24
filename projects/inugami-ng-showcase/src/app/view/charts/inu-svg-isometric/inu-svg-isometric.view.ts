import {Component} from '@angular/core';

import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuSvgIsometric} from 'inugami-ng/components/inu-svg-isometric';

@Component({
  templateUrl: './inu-svg-isometric.view.html',
  styleUrls: ['./inu-svg-isometric.view.scss'],
  imports: [

    InuTableFlex,
    InuTableFlexCell,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuCode,
    InuSvgIsometric
  ]
})
export class InuSvgIsometricView {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {


  }


}
