import {Component, signal} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {
  InuDocItem
} from 'inugami-ng/components/inu-doc-item';

@Component({
  templateUrl: './inu-doc-item.view.html',
  styleUrls: ['./inu-doc-item.view.scss'],
  imports: [
    InuTableFlex,
    InuTableFlexCell,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuDocItem
  ]
})
export class InuDocItemView {
  genericString = signal<string>('<string>')
}
