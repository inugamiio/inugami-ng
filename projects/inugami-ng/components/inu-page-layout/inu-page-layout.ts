import {Component, computed, inject, input} from '@angular/core';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {InuAsideMenu} from 'inugami-ng/components/inu-aside-menu'
import {InuSiteLink} from 'inugami-ng/models'
import {NgTemplateOutlet} from '@angular/common'

@Component({
             selector   : 'inu-page-layout',
             standalone : true,
             providers  : [InuTemplateRegistryService],
             imports: [InuAsideMenu, NgTemplateOutlet],
             templateUrl: './inu-page-layout.html',
             styleUrl   : './inu-page-layout.scss',
           })
export class InuPageLayout {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  links = input<InuSiteLink[]>([]);
  menuTemplate = computed(() => this.registry.getTemplate('menu'));
  registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);
}
