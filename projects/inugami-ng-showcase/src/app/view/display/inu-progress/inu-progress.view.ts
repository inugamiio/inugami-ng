import {Component, signal} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';

import {InuProgress} from 'inugami-ng/components/inu-progress';
import {InuCode} from 'inugami-ng/components/inu-code'

@Component({
             templateUrl: './inu-progress.view.html',
             styleUrls  : ['./inu-progress.view.scss'],
             imports: [
               InuProgress,
               InuTableFlex,
               InuTableFlexCell,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuCode
             ]
           })
export class InuProgressView {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  value = signal<number>(0.5);
  //==================================================================================================================
  // CONSTRUCTOR
  //==================================================================================================================
  constructor() {
    setInterval(() => this.updateValue(), 1000);
  }

  //==================================================================================================================
  // EVENT
  //==================================================================================================================
  private updateValue() {

    let value = this.value() + 0.1;
    if (value >= 1) {
      value = 0;
    }
    this.value.set(value);
  }
}
