import {Component, signal} from '@angular/core';
import {InuPanelTab, InuPanelTabs} from "inugami-ng/components/inu-panel-tabs";
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuCopy} from 'inugami-ng/components/inu-copy';
import {InuCode} from 'inugami-ng/components/inu-code';
@Component({
  templateUrl: './inu-copy.view.html',
  styleUrls: ['./inu-copy.view.scss'],
  imports: [
    InuPanelTabs,
    InuPanelTab,
    InuTableFlex,
    InuTableFlexCell,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuCopy,
    InuCode
  ]
})
export class InuCopyView {
  genericString = signal<string>('<string>')
}
