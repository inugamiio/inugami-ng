import {Component, signal, WritableSignal} from '@angular/core';
import {InuCite} from 'inugami-ng/components/inu-cite';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InugamiTemplateDirective} from 'inugami-ng/directives';

@Component({
  templateUrl: './inu-cite.view.html',
  styleUrls: ['./inu-cite.view.scss'],
  imports: [
    InuCite,
    InugamiTemplateDirective,
    InuCode
  ]
})
export class InuCiteView {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  levels: WritableSignal<string[]> = signal<string[]>([
    'info',
    'success',
    'warning',
    'danger'
  ]);


}
