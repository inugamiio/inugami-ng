import {Component, signal, WritableSignal} from '@angular/core';
import {InuCite} from 'inugami-ng/components/inu-cite';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InugamiTemplateDirective} from 'inugami-ng/directives';

@Component({
  templateUrl: './inu-aside-menu.view.html',
  styleUrls: ['./inu-aside-menu.view.scss'],
             imports: [
               InuCode,
               InuCite
             ]
           })
export class InuAsideMenuView {



}
