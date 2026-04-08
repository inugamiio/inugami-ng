import {Component, computed, inject, input} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {InuSiteLinkChildren} from 'inugami-ng/models'
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router'
import {toSignal} from '@angular/core/rxjs-interop'

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
  activeFragment = toSignal(inject(ActivatedRoute).fragment);
  children          = input<InuSiteLinkChildren[]>([]);
  level             = input<number>(0);
  currentStyleClass = computed(() => ['inu-aside-menu-children', `level level-${this.level()}`]
    .join(' '));
}
