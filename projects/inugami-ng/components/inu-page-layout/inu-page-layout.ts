import {Component, input} from '@angular/core';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {InuAsideMenu} from '../inu-aside-menu/inu-aside-menu.component'
import {InuSiteLink} from 'inugami-ng/models'

@Component({
             selector   : 'inu-page-layout',
             standalone : true,
             providers  : [InuTemplateRegistryService],
             imports    : [InuAsideMenu],
             templateUrl: './inu-page-layout.html',
             styleUrl   : './inu-page-layout.scss',
           })
export class InuPageLayout {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  links = input<InuSiteLink[]>([]);

}
