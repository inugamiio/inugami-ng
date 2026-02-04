import {Component, signal} from '@angular/core';
import {InuPanelTab, InuPanelTabs} from "inugami-ng/components/inu-panel-tabs";
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuCode} from 'inugami-ng/components/inu-code';
@Component({
  templateUrl: './inu-panel-tabs.view.html',
  styleUrls: ['./inu-panel-tabs.view.scss'],
  imports: [
    InuPanelTabs,
    InuPanelTab,
    InuTableFlex,
    InuTableFlexCell,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuCode
  ]
})
export class InuPanelTabsView {
  genericString = signal<string>('<string>')
}
