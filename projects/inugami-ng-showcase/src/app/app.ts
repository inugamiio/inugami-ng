import {Component, inject, OnInit, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {GaActionEnum, GoogleAnalyticsService} from 'ngx-google-analytics';
import {filter} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  private readonly gaService = inject(GoogleAnalyticsService);
  private readonly titleService = inject(Title)
  private router = inject(Router);
  private scroller = inject(ViewportScroller);
  protected readonly title = signal('inugami-website');


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
