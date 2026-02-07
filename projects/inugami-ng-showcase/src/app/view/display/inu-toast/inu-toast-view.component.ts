import {Component, inject, signal} from '@angular/core';
import {InuPanelTab, InuPanelTabs} from "inugami-ng/components/inu-panel-tabs";
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuToastServices} from 'inugami-ng/components/inu-toast';

@Component({
  templateUrl: './inu-toast-view.component.html',
  styleUrls: ['./inu-toast-view.component.scss'],
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
export class InuToastView {

  toastServices = inject(InuToastServices);

  protected addMessage() {
    this.toastServices.addMessage({
      title: 'Hello',
      message: 'some message',

    })
  }
}
