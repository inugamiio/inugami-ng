import {Component} from '@angular/core';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuLabel} from 'inugami-ng/components/inu-label';

@Component({
  templateUrl: './inu-label.view.html',
  styleUrls: ['./inu-label.view.scss'],
             imports: [
               InuCode,
               InuLabel
             ]
           })
export class InuLabelView {

}
