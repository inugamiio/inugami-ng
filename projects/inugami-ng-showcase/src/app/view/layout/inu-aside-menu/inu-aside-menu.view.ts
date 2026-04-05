import {Component, signal} from '@angular/core';
import {InuSiteLink, TARGET_BLANK} from 'inugami-ng/models'
import {InuAsideMenu} from 'inugami-ng/components/inu-aside-menu';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuPanelTab, InuPanelTabs} from "inugami-ng/components/inu-panel-tabs";

@Component({
             templateUrl: './inu-aside-menu.view.html',
             styleUrls  : ['./inu-aside-menu.view.scss'],
             imports: [
               InuAsideMenu,
               InuCode,
               InuPanelTab,
               InuPanelTabs
             ]
           })
export class InuAsideMenuView {

  links = signal<InuSiteLink[]>([
                                  {
                                    title   : 'GitHub',
                                    path    : 'https://github.com/inugamiio/inugami-ng',
                                    external: true,
                                    target  : TARGET_BLANK,
                                    icon    : 'git'
                                  },
                                  {
                                    title: 'Icons',
                                    path : '/icons',
                                    icon : 'image'
                                  },
                                  //--- ACTIONS ---------------------------------------------------------
                                  {
                                    title   : 'Actions',
                                    icon    : 'terminal',
                                    children: [
                                      {
                                        links: [
                                          {
                                            title: 'inu-button',
                                            path : '/actions/inu-button'
                                          },
                                          {
                                            title: 'inu-copy',
                                            path : '/actions/inu-copy'
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]);

}
