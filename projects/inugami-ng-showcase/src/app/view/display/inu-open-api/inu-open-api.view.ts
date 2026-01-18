import {Component} from '@angular/core';
import {InuCite} from 'inugami-ng/components/inu-cite';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuOpenApi} from 'inugami-ng/components/inu-open-api';

@Component({
  templateUrl: './inu-open-api.view.html',
  styleUrls: ['./inu-open-api.view.scss'],
  imports: [
    InuCite,
    InuOpenApi,
    InuCode,
    InuCite
  ]
})
export class InuOpenApiView {

}
