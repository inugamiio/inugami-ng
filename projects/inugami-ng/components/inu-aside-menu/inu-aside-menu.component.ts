import {AfterViewInit, Component, computed, effect, input, signal} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {NgClass} from '@angular/common';
import {InuSiteLink} from 'inugami-ng/models'
import {RouterLink, RouterLinkActive} from '@angular/router'
import {InuAsideMenuChildren} from './children/inu-aside-menu-children.component'

@Component({
  selector: 'inu-aside-menu',
  standalone: true,
             imports: [InuIcon,
                       NgClass,
                       RouterLinkActive,
                       RouterLink,
                       InuAsideMenuChildren],
  templateUrl: './inu-aside-menu.component.html',
  styleUrl: './inu-aside-menu.component.scss',
})
export class InuAsideMenu{
  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  links             = input<InuSiteLink[]>([]);

}
