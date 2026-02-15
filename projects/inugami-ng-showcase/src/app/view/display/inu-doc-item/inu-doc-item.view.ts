import {Component, signal, viewChildren} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuDocItem, InuDocSummary} from 'inugami-ng/components/inu-doc-item';

@Component({
  templateUrl: './inu-doc-item.view.html',
  styleUrls: ['./inu-doc-item.view.scss'],
  imports: [
    InuTableFlex,
    InuTableFlexCell,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuDocItem,
    InuDocSummary,
    InuCode
  ]
})
export class InuDocItemView {
  genericString = signal<string>('<string>')

  readonly children = viewChildren(InuDocItem);


}
