import {Component, signal} from '@angular/core';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuDocItem} from 'inugami-ng/components/inu-doc-item'
import {InuCite} from 'inugami-ng/components/inu-cite'


@Component({
             templateUrl: './inu-cache-service.view.html',
             styleUrls  : ['./inu-cache-service.view.scss'],
             imports    : [
               InuCode,
               InuCode,
               InuDocItem,
               InuCite,
               InuCite
             ]
           })
export class InuCacheServiceView {
  genericT = signal<string>('<T>')
}
