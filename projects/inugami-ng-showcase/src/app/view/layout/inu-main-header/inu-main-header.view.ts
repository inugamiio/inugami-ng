import {Component} from '@angular/core';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuTableFlex, InuTableFlexCell, InuTableFlexHeader, InuTableFlexRow} from 'inugami-ng/components/inu-table-flex'

@Component({
  templateUrl: './inu-main-header.view.html',
  styleUrls: ['./inu-main-header.view.scss'],
             imports: [
               InuCode,
               InuTableFlex,
               InuTableFlexCell,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuTableFlex,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuTableFlexCell
             ]
           })
export class InuMainHeaderView {



}
