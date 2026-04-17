import {Component, signal, WritableSignal} from '@angular/core';
import {InuCite} from 'inugami-ng/components/inu-cite';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuToolTips} from 'inugami-ng/components/inu-tool-tips';
import {InugamiTemplateDirective} from 'inugami-ng/directives';
import {InuIcon} from 'inugami-icons'
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';

@Component({
             templateUrl: './inu-tool-tips.view.html',
             styleUrls  : ['./inu-tool-tips.view.scss'],
             imports    : [
               InugamiTemplateDirective,
               InuCode,
               InuToolTips,
               InuIcon,
               InuTableFlex,
               InuTableFlexCell,
               InuTableFlexHeader,
               InuTableFlexRow
             ]
           })
export class InuToolTipsView {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  levels: WritableSignal<string[]> = signal<string[]>([
                                                        'info',
                                                        'success',
                                                        'warning',
                                                        'danger'
                                                      ]);


}
