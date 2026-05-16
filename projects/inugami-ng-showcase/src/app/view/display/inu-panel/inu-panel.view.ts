import {Component} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';

import {InuPanel} from 'inugami-ng/components/inu-panel';
import {InugamiTemplateDirective} from 'inugami-ng/directives'
import {InuCode} from 'inugami-ng/components/inu-code'

@Component({
             templateUrl: './inu-panel.view.html',
             styleUrls  : ['./inu-panel.view.scss'],
             imports: [
               InuPanel,
               InuTableFlex,
               InuTableFlexCell,
               InuTableFlexHeader,
               InuTableFlexRow,
               InugamiTemplateDirective,
               InuCode
             ]
           })
export class InuPanelView {

}
