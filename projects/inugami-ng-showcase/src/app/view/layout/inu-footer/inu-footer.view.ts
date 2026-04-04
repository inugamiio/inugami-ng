import {Component, signal, WritableSignal} from '@angular/core';
import {InuCite} from 'inugami-ng/components/inu-cite';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InugamiTemplateDirective} from 'inugami-ng/directives';

@Component({
  templateUrl: './inu-footer.view.html',
  styleUrls: ['./inu-footer.view.scss'],
             imports: [
               InuCode,
               InuCite
             ]
           })
export class InuFooterView {



}
