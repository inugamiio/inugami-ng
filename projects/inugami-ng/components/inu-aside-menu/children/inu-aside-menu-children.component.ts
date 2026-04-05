import {AfterViewInit, Component, computed, effect, input, signal} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {NgClass} from '@angular/common';
import {InuSiteLink, InuSiteLinkChildren} from 'inugami-ng/models'
import {RouterLink, RouterLinkActive} from '@angular/router'

@Component({
             selector   : 'inu-aside-menu-children',
             standalone : true,
             imports    : [InuIcon, RouterLinkActive, RouterLink],
             templateUrl: './inu-aside-menu-children.component.html',
             styleUrl   : './inu-aside-menu-children.component.scss',
           })
export class InuAsideMenuChildren {
  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  children = input<InuSiteLinkChildren[]>([]);
  level    = input<number>(0);
  currentStyleClass = computed(()=> ['inu-aside-menu-children', `level level-${this.level()}`]
    .join(' '));
}
