import {Component} from '@angular/core';
import {InuCite} from 'inugami-ng/components/inu-cite';
import {InuCode} from 'inugami-ng/components/inu-code';

@Component({
  templateUrl: './inu-code.view.html',
  styleUrls: ['./inu-code.view.scss'],
  imports: [
    InuCite,
    InuCode
  ]
})
export class InuCodeView {

}
