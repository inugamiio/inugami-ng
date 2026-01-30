import {Component, signal} from '@angular/core';
import {InuCode} from 'inugami-ng/components/inu-code';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';


@Component({
  templateUrl: './inu-table-flex.view.html',
  styleUrls: ['./inu-table-flex.view.scss'],
  imports: [
    InuTableFlex,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuTableFlexCell,
    InuCode
  ]
})
export class InuTableFlexView {
  genericT = signal<string>('<T>')
}
