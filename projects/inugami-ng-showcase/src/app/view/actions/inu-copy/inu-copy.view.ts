import {Component, signal} from '@angular/core';
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
    InuTableFlex,
    InuTableFlexCell,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuCopy,
    InuCode
  ]
})
export class InuCopyView {
}
