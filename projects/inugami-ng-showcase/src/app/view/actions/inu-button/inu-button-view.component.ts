import {Component, inject} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuButton} from 'inugami-ng/components/inu-button';
import {InuToastServices} from 'inugami-ng/components/inu-toast';
import {InuCode} from 'inugami-ng/components/inu-code';

@Component({
  templateUrl: './inu-button-view.component.html',
  styleUrls: ['./inu-button-view.component.scss'],
  imports: [
    InuTableFlex,
    InuTableFlexCell,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuButton,
    InuCode
  ]
})
export class InuButtonView {
  toastServices = inject(InuToastServices);

  protected addMessage() {
    this.toastServices.addMessage({
      title: 'Hello',
      message: 'some message',
      level: "info",
      icon:'idea'
    })
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
