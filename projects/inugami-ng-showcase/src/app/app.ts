import {Component, inject, OnInit, signal} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {GaActionEnum, GoogleAnalyticsService} from 'ngx-google-analytics';
import {filter} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {InuSiteLink, TARGET_BLANK} from 'inugami-ng/models';
import {InuToast} from 'inugami-ng/components/inu-toast';
import {InuFooter} from 'inugami-ng/components/inu-footer';
import {InuMainHeader} from 'inugami-ng/components/inu-main-header';
import {InuPageLayout} from 'inugami-ng/components/inu-page-layout';

@Component({
             selector   : 'app-root',
             imports    : [
               RouterOutlet,
               InuToast,
               InuMainHeader,
               InuFooter,
               InuPageLayout
             ],
             templateUrl: './app.html',
             styleUrl   : './app.scss'
           })
export class App implements OnInit {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  private readonly gaService    = inject(GoogleAnalyticsService);
  private readonly titleService = inject(Title)
  private router                = inject(Router);
  private scroller              = inject(ViewportScroller);
  protected readonly title      = signal('inugami-ng-showcase');
  protected links               = signal<InuSiteLink[]>([
                                                          {
                                                            title   : 'Inugami Framework',
                                                            path    : 'https://inugami.io/inugami/framework',
                                                            external: true
                                                          },
                                                          {
                                                            title   : 'Inugami Dashboard',
                                                            path    : 'https://inugami.io/inugami/dashboard',
                                                            external: true
                                                          },
                                                          {
                                                            title   : 'inugami-project-analysis-maven-plugin',
                                                            path    : 'https://inugami.io/maven/inugami_project_analysis_maven_plugin',
                                                            external: true
                                                          },
                                                          {
                                                            title     : 'Inugami NG showcase',
                                                            path      : '',
                                                            gaEvent   : 'inugamiio_showcase',
                                                            gaCategory: 'internal_link',
                                                            target    : TARGET_BLANK
                                                          },
                                                          {
                                                            title     : 'GitHub',
                                                            path      : 'https://github.com/inugamiio',
                                                            external  : true,
                                                            gaEvent   : 'github_inugamiio',
                                                            gaCategory: 'external_link',
                                                            target    : TARGET_BLANK
                                                          },
                                                          {
                                                            title     : 'Maven central',
                                                            path      : 'https://central.sonatype.com/artifact/io.inugami/inugami/overview',
                                                            external  : true,
                                                            gaEvent   : 'maven_central_inugamiio',
                                                            gaCategory: 'external_link',
                                                            target    : TARGET_BLANK
                                                          },
                                                          {
                                                            title     : 'NPM',
                                                            path      : 'https://www.npmjs.com/package/inugami-ng',
                                                            external  : true,
                                                            gaEvent   : 'npm_inugaming',
                                                            gaCategory: 'external_link',
                                                            target    : TARGET_BLANK
                                                          }
                                                        ]);

  protected asideLinks = signal<InuSiteLink[]>([
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
                                                 },
                                                 //--- CHARTS ----------------------------------------------------------
                                                 {
                                                   title   : 'Charts',
                                                   icon    : 'chart',
                                                   children: [
                                                     {
                                                       links: [
                                                         {
                                                           title: 'inu-svg-assets',
                                                           path : '/charts/inu-svg-assets'
                                                         },
                                                         {
                                                           title: 'inu-svg-utils',
                                                           path : '/charts/inu-svg-utils'
                                                         },
                                                         {
                                                           title: 'inu-svg-isometric',
                                                           path : '/charts/inu-svg-isometric'
                                                         },
                                                         {
                                                           title: 'inu-svg-switzerland',
                                                           path : '/charts/inu-svg-switzerland'
                                                         }
                                                       ]
                                                     }
                                                   ]
                                                 },
                                                 //--- DISPLAY ---------------------------------------------------------
                                                 {
                                                   title   : 'Display',
                                                   icon    : 'eye',
                                                   children: [
                                                     {
                                                       links: [
                                                         {
                                                           title: 'inu-cite',
                                                           path : '/display/inu-cite'
                                                         },
                                                         {
                                                           title: 'inu-code',
                                                           path : '/display/inu-code'
                                                         },
                                                         {
                                                           title: 'inu-doc-item',
                                                           path : '/display/inu-doc-item'
                                                         },
                                                         {
                                                           title: 'inu-open-api',
                                                           path : '/display/inu-open-api'
                                                         },
                                                         {
                                                           title: 'inu-panel-tabs',
                                                           path : '/display/inu-panel-tabs'
                                                         },
                                                         {
                                                           title: 'inu-toast',
                                                           path : '/display/inu-toast'
                                                         }
                                                       ]
                                                     }
                                                   ]
                                                 },

                                                 //--- FORMS -----------------------------------------------------------
                                                 {
                                                   title   : 'Forms',
                                                   icon    : 'tasks',
                                                   children: [
                                                     {
                                                       links: [
                                                         {
                                                           title: 'inu-checkbox-group',
                                                           path : '/forms/inu-checkbox-group'
                                                         },
                                                         {
                                                           title: 'inu-input-text',
                                                           path : '/forms/inu-input-text'
                                                         }
                                                       ]
                                                     }
                                                   ]
                                                 },

                                                 //--- LAYOUT ----------------------------------------------------------
                                                 {
                                                   title   : 'Layout',
                                                   icon    : 'layoutTab',
                                                   children: [
                                                     {
                                                       links: [
                                                         {
                                                           title: 'inu-aside-menu',
                                                           path : '/layout/inu-aside-menu'
                                                         },
                                                         {
                                                           title: 'inu-footer',
                                                           path : '/layout/inu-footer'
                                                         },
                                                         {
                                                           title: 'inu-main-header',
                                                           path : '/layout/inu-main-header'
                                                         },
                                                         {
                                                           title: 'inu-page-layout',
                                                           path : '/layout/inu-page-layout'
                                                         }
                                                       ]
                                                     }
                                                   ]
                                                 },

                                                 //--- TABLES ----------------------------------------------------------
                                                 {
                                                   title   : 'Tables',
                                                   icon    : 'kanban',
                                                   children: [
                                                     {
                                                       links: [
                                                         {
                                                           title: 'inu-table-flex',
                                                           path : '/tables/inu-table-flex'
                                                         }
                                                       ]
                                                     }
                                                   ]
                                                 },

                                                 //--- UTILS -----------------------------------------------------------
                                                 {
                                                   title   : 'Utils',
                                                   icon    : 'tool',
                                                   children: [
                                                     {
                                                       links: [
                                                         {
                                                           title: 'inu-cache-service',
                                                           path : '/utils/inu-cache-service'
                                                         },
                                                         {
                                                           title: 'inu-error-service',
                                                           path : '/utils/inu-error-service'
                                                         },
                                                         {
                                                           title: 'inu-forms-utils',
                                                           path : '/utils/inu-forms-utils'
                                                         },
                                                         {
                                                           title: 'inu-string-utils',
                                                           path : '/utils/inu-string-utils'
                                                         }
                                                       ]
                                                     }
                                                   ]
                                                 }
                                               ]);

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    this.router.events.pipe(
      takeUntilDestroyed(),
      filter(event => event instanceof NavigationEnd)).subscribe({
                                                                   next: (event: NavigationEnd) => {
                                                                     this.pageTracker(event);
                                                                   }
                                                                 });
  }

  ngOnInit(): void {
    this.scroller.setOffset([0, 80]);


  }

  pageTracker(event: NavigationEnd) {
    if (event.url) {
      const urlParts = event.url.split('/');
      const page     = urlParts[urlParts.length - 1];
      this.titleService.setTitle(`Inugami - ${page.split('#')[0]}`);
      this.gaService.event(GaActionEnum.VIEW_ITEM, event.url);
      this.gaService.pageView(event.url);

    }
  }

}
