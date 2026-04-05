import {Component, input, signal} from '@angular/core';
import {InuIcon} from 'inugami-icons'
import {RouterLink, RouterLinkActive} from '@angular/router'
import {InuSiteLink} from 'inugami-ng/models'

@Component({
             selector   : 'inu-main-header',
             standalone : true,
             imports    : [
               InuIcon,
               RouterLink,
               RouterLinkActive
             ],
             templateUrl: './inu-main-header.html',
             styleUrl   : './inu-main-header.scss',
           })
export class InuMainHeader {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  icon              = input<string>('');
  disableIcon       = input<boolean>(false);
  links             = input<InuSiteLink[]>([]);
  displayMenuBurger = signal<boolean>(false);

  protected toggleDisplay() {
    const display = this.displayMenuBurger();
    this.displayMenuBurger.set(!display);
  }
}
