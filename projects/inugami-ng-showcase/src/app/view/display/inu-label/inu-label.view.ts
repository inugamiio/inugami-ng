import {Component} from '@angular/core';
import {InuCite} from 'inugami-ng/components/inu-cite';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuLabel} from 'inugami-ng/components/inu-label';

@Component({
  templateUrl: './inu-label.view.html',
  styleUrls: ['./inu-label.view.scss'],
  imports: [
    InuCite,
    InuCode,
    InuLabel
  ]
})
export class InuLabelView {

}
