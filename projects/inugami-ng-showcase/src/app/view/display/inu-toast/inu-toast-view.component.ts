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
import {InuButton} from 'inugami-ng/components/inu-button';

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
    InuCode,
    InuButton
  ]
})
export class InuToastView {

  toastServices = inject(InuToastServices);

  protected addMessage() {
    this.toastServices.addMessage({
      title: 'Hello',
      message: 'some message',
      level: "info",
      icon:'idea'
    });
  }

  protected addDebugMessage() {
    this.toastServices.addMessage({
      title: 'Debug information',
      message: 'some debug message',
      level: "debug",
      icon:'bug'
    })
  }

  protected addSuccessMessage() {
    this.toastServices.addMessage({
      title: 'Success',
      message: 'some success message',
      level: "success",
      icon:'approval'
    })
  }

  protected addWarnMessage() {
    this.toastServices.addMessage({
      title: 'Warning',
      message: 'some warning message',
      level: "warn",
      icon:'warning'
    })
  }

  protected addErrorMessage() {
    this.toastServices.addMessage({
      title: 'Error',
      message: 'some error message',
      level: "error",
      icon:'danger'
    })
  }
}
