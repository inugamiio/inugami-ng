import {Component, computed, inject, input} from '@angular/core';
import {InuIcon} from 'inugami-icons';
import {InuSiteLink, InuSiteLinkChildren} from 'inugami-ng/models'
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router'
import {toSignal} from '@angular/core/rxjs-interop'
import {filter, map} from 'rxjs'

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
  private activatedRoute    = inject(ActivatedRoute);
  private router = inject(Router);
  activeFragment    = toSignal(this.activatedRoute.fragment);
  currentUrlString = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0])
    ),
    { initialValue: this.router.url.split('?')[0] }
  );
  children          = input<InuSiteLinkChildren[]>([]);
  level             = input<number>(0);
  currentStyleClass = computed(() => ['inu-aside-menu-children', `level level-${this.level()}`]
    .join(' '));


  showChildren(childLink: InuSiteLink): boolean {
    console.log('showChildren',childLink)
    if (!childLink.children || childLink.children.length == 0) {
      return false;
    }
    if (childLink.forceShowChildren != undefined && childLink.forceShowChildren) {
      return true;
    }
    const url = this.currentUrlString();
    return url === childLink.path;
  }
}
