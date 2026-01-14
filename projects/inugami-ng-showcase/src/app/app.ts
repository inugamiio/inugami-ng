import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {GaActionEnum, GoogleAnalyticsService} from 'ngx-google-analytics';
import {filter} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SiteLink} from './models/website-model';
import {InugamiNgAsideComponent} from './components/inugami-ng-aside/inugami-ng-aside.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    InugamiNgAsideComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  private readonly gaService = inject(GoogleAnalyticsService);
  private readonly titleService = inject(Title)
  private router = inject(Router);
  private scroller = inject(ViewportScroller);
  protected readonly title = signal('inugami-ng-showcase');
  protected links: WritableSignal<SiteLink[]> = signal<SiteLink[]>([
    {
      title: 'Inugami Framework',
      path: 'https://inugami.io/inugami/framework',
      external: true
    },
    {
      title: 'Inugami Dashboard',
      path: 'https://inugami.io/inugami/dashboard',
      external: true
    },
    {
      title: 'inugami-project-analysis-maven-plugin',
      path: 'https://inugami.io/maven/inugami_project_analysis_maven_plugin',
      external: true
    },
    {
      title: 'Inugami NG showcase',
      path: '',
      gaEvent:'inugamiio_showcase',
      gaCategory:'internal_link'
    },
    {
      title: 'GitHub',
      path: 'https://github.com/inugamiio',
      external: true,
      gaEvent:'github_inugamiio',
      gaCategory:'external_link'
    },
    {
      title: 'Maven central',
      path: 'https://central.sonatype.com/artifact/io.inugami/inugami/overview',
      external: true,
      gaEvent:'maven_central_inugamiio',
      gaCategory:'external_link'
    }
  ]);

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    this.router.events.pipe(
          takeUntilDestroyed(),
          filter(event => event instanceof NavigationEnd)).subscribe({
                next: (event:NavigationEnd) => {
                    this.pageTracker(event);
                }
            });
  }
  ngOnInit(): void {
   this.scroller.setOffset([0, 80]);


  }
  pageTracker(event: NavigationEnd) {
    if(event.url){
      const urlParts = event.url.split('/');
      const page = urlParts[urlParts.length-1];
      this.titleService.setTitle(`Inugami - ${page.split('#')[0]}`);
      this.gaService.event(GaActionEnum.VIEW_ITEM, event.url);
      this.gaService.pageView(event.url);

    }
  }

}
